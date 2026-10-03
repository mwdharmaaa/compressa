import type { CompressionOptions, CompressionProgress, CompressionResult } from '@/core/types/compression.types'
import type { VideoMetadata } from '@/core/types/video.types'
import { calculateScaledResolution } from '@/core/utils/resolution_calculator'
import { calculateBitrates } from '@/core/utils/bitrate_calculator'
import { calculateSavings } from '@/core/utils/file_size_formatter'
import { detectSupportedCodecs } from '@/core/engine/codec_support_detector'
import { setupAudioRouting } from '@/core/engine/audio_routing'

export function compressVideo(
  file: File,
  metadata: VideoMetadata,
  options: CompressionOptions,
  onProgress: (progress: CompressionProgress) => void,
  signal?: AbortSignal
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Compression aborted', 'AbortError'))
    }

    const startClip = Math.max(0, options.timeRange.start)
    const endClip = Math.min(metadata.duration, options.timeRange.end > 0 ? options.timeRange.end : metadata.duration)
    const clipDuration = Math.max(0.1, endClip - startClip)

    const scaled = calculateScaledResolution(metadata.width, metadata.height, options.resolutionPreset, options.customScale)
    const bitrates = calculateBitrates({
      mode: options.mode,
      durationSeconds: clipDuration,
      targetSizeMb: options.targetSizeMb,
      qualityCrf: options.qualityCrf,
      manualVideoBitrateKbps: options.manualVideoBitrateKbps,
      audioOption: options.audioOption,
      audioBitrateKbps: options.audioBitrateKbps,
    })

    const codecs = detectSupportedCodecs()
    let chosenMime = codecs.webmMimeType
    let outputFormat = options.format

    if (options.format === 'mp4' && codecs.supportsMp4 && codecs.mp4MimeType) {
      chosenMime = codecs.mp4MimeType
    } else if (options.format === 'mp4' && !codecs.supportsMp4) {
      outputFormat = 'webm'
    }

    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)
    video.src = objectUrl
    video.preload = 'auto'
    video.playsInline = true
    video.muted = options.audioOption === 'mute'

    const canvas = document.createElement('canvas')
    canvas.width = scaled.width
    canvas.height = scaled.height
    const ctx = canvas.getContext('2d', { alpha: false })

    let recorder: MediaRecorder | null = null
    let animFrameId: number | null = null
    let audioCleanup: () => void = () => {}
    const chunks: Blob[] = []
    const startTimeReal = performance.now()

    const tearDown = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId)
      audioCleanup()
      video.pause()
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(objectUrl)
    }

    signal?.addEventListener('abort', () => {
      tearDown()
      if (recorder && recorder.state !== 'inactive') recorder.stop()
      reject(new DOMException('Compression aborted', 'AbortError'))
    }, { once: true })

    video.onloadedmetadata = () => {
      video.currentTime = startClip
    }

    video.onseeked = () => {
      if (recorder) return // already started

      const { audioTrack, cleanup } = setupAudioRouting(video, options.audioOption === 'mute')
      audioCleanup = cleanup

      const stream = canvas.captureStream(options.targetFps || 30)
      if (audioTrack) stream.addTrack(audioTrack)

      try {
        recorder = new MediaRecorder(stream, {
          mimeType: chosenMime,
          videoBitsPerSecond: bitrates.videoBitrateBps,
          audioBitsPerSecond: bitrates.audioBitrateBps,
        })
      } catch (err) {
        tearDown()
        return reject(err)
      }

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        tearDown()
        const finalBlob = new Blob(chunks, { type: chosenMime })
        const compressedSize = finalBlob.size
        const { savedBytes, percentReduction } = calculateSavings(metadata.size, compressedSize)
        const finalUrl = URL.createObjectURL(finalBlob)

        resolve({
          blob: finalBlob,
          url: finalUrl,
          originalSize: metadata.size,
          compressedSize,
          compressionRatio: Number((metadata.size / Math.max(1, compressedSize)).toFixed(1)),
          savedBytes,
          duration: clipDuration,
          width: scaled.width,
          height: scaled.height,
          format: outputFormat,
        })
      }

      recorder.start(1000)
      video.playbackRate = Math.max(0.5, Math.min(3.0, options.speedMultiplier || 1.0))
      video.play().catch(reject)

      const renderLoop = () => {
        if (signal?.aborted) return

        if (ctx) ctx.drawImage(video, 0, 0, scaled.width, scaled.height)

        const currentPos = video.currentTime
        const processedSec = Math.max(0, currentPos - startClip)
        const progressFrac = Math.min(1.0, processedSec / clipDuration)
        const elapsedReal = (performance.now() - startTimeReal) / 1000
        const currentSpeed = elapsedReal > 0 ? processedSec / elapsedReal : 1.0
        const remSec = currentSpeed > 0 ? (clipDuration - processedSec) / currentSpeed : 0

        onProgress({
          percentage: Number((progressFrac * 100).toFixed(1)),
          processedSeconds: Number(processedSec.toFixed(1)),
          totalSeconds: clipDuration,
          currentFps: options.targetFps || 30,
          estimatedRemainingSeconds: Math.max(0, Math.round(remSec)),
        })

        if (currentPos >= endClip || video.ended) {
          if (recorder && recorder.state !== 'inactive') {
            recorder.stop()
          }
          return
        }

        animFrameId = requestAnimationFrame(renderLoop)
      }

      animFrameId = requestAnimationFrame(renderLoop)
    }

    video.onerror = () => {
      tearDown()
      reject(new Error('Failed to decode source video during compression'))
    }
  })
}
