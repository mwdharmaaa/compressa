import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

// Simple script to generate valid uncompressed RGBA PNG files with Compressa colors
function createPng(width, height, r, g, b, innerR, innerG, innerB) {
  const bytesPerPixel = 4
  const rowSize = 1 + width * bytesPerPixel
  const rawData = Buffer.alloc(height * rowSize)

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize
    rawData[rowOffset] = 0 // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel

      // Inner icon square with rounded border simulation
      const border = Math.round(width * 0.12)
      const isInner =
        x >= border && x < width - border && y >= border && y < height - border

      const centerSize = Math.round(width * 0.25)
      const isCenter =
        Math.abs(x - width / 2) < centerSize && Math.abs(y - height / 2) < centerSize

      if (isCenter) {
        rawData[pxOffset] = innerR
        rawData[pxOffset + 1] = innerG
        rawData[pxOffset + 2] = innerB
        rawData[pxOffset + 3] = 255
      } else if (isInner) {
        rawData[pxOffset] = 39
        rawData[pxOffset + 1] = 39
        rawData[pxOffset + 2] = 42
        rawData[pxOffset + 3] = 255
      } else {
        rawData[pxOffset] = r
        rawData[pxOffset + 1] = g
        rawData[pxOffset + 2] = b
        rawData[pxOffset + 3] = 255
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData)

  function crc32(buf) {
    let crc = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i]
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320)
      }
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type, 'ascii')
    const combined = Buffer.concat([typeBuf, data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(combined), 0)
    return Buffer.concat([len, combined, crc])
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr)
  const idatChunk = makeChunk('IDAT', compressedData)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

const publicDir = path.resolve('public')
const icon192 = createPng(192, 192, 24, 24, 27, 59, 130, 246)
const icon512 = createPng(512, 512, 24, 24, 27, 59, 130, 246)

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192)
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), icon192)
console.log('PWA icons created successfully')
