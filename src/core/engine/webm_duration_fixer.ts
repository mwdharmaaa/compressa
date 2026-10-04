/**
 * Fixes missing or zero duration in WebM blobs produced by browser MediaRecorder.
 * Injects or updates the EBML Duration element inside the Segment Info block.
 */

export async function fixWebmDuration(blob: Blob, durationSeconds: number): Promise<Blob> {
  if (durationSeconds <= 0 || !blob.type.includes('webm')) {
    return blob
  }

  try {
    const buffer = await blob.arrayBuffer()
    const view = new DataView(buffer)
    const bytes = new Uint8Array(buffer)

    // Check EBML header signature [0x1A, 0x45, 0xDF, 0xA3]
    if (bytes[0] !== 0x1a || bytes[1] !== 0x45 || bytes[2] !== 0xdf || bytes[3] !== 0xa3) {
      return blob
    }

    // Search for Segment Info element ID [0x15, 0x49, 0xA9, 0x66] in first 8KB
    const searchLimit = Math.min(bytes.length - 12, 8192)
    let infoPos = -1

    for (let i = 0; i < searchLimit; i++) {
      if (
        bytes[i] === 0x15 &&
        bytes[i + 1] === 0x49 &&
        bytes[i + 2] === 0xa9 &&
        bytes[i + 3] === 0x66
      ) {
        infoPos = i
        break
      }
    }

    if (infoPos === -1) {
      return blob
    }

    // Search for Duration tag [0x44, 0x89] inside Info block (within 512 bytes)
    const infoSearchLimit = Math.min(bytes.length - 10, infoPos + 512)
    let durationPos = -1

    for (let i = infoPos + 4; i < infoSearchLimit; i++) {
      if (bytes[i] === 0x44 && bytes[i + 1] === 0x89) {
        durationPos = i
        break
      }
    }

    const durationMs = durationSeconds * 1000

    if (durationPos !== -1) {
      // Duration tag found: check data length
      const lengthByte = bytes[durationPos + 2]
      if (lengthByte === 0x84) {
        // 4-byte float (length = 4)
        view.setFloat32(durationPos + 3, durationMs, false)
        return new Blob([buffer], { type: blob.type })
      } else if (lengthByte === 0x88) {
        // 8-byte float (length = 8)
        view.setFloat64(durationPos + 3, durationMs, false)
        return new Blob([buffer], { type: blob.type })
      }
    }

    // If tag was not present, inject [0x44, 0x89, 0x88, <8-byte float durationMs>] into Info block
    // Position right after Info ID (4 bytes) and Info size (variable 1-4 bytes)
    let offset = infoPos + 4
    let sizeLen = 1
    const firstByte = bytes[offset]

    if (firstByte & 0x80) sizeLen = 1
    else if (firstByte & 0x40) sizeLen = 2
    else if (firstByte & 0x20) sizeLen = 3
    else if (firstByte & 0x10) sizeLen = 4

    const insertPos = offset + sizeLen

    const durationElement = new Uint8Array(11)
    durationElement[0] = 0x44
    durationElement[1] = 0x89
    durationElement[2] = 0x88 // 8-byte float
    const durView = new DataView(durationElement.buffer)
    durView.setFloat64(3, durationMs, false)

    const before = bytes.slice(0, insertPos)
    const after = bytes.slice(insertPos)

    return new Blob([before, durationElement, after], { type: blob.type })
  } catch {
    // If parsing fails, safely return the original blob
    return blob
  }
}
