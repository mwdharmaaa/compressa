import {
  Input,
  Output,
  Conversion,
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  Quality,
  canEncodeVideo,
  ConversionCanceledError,
} from 'mediabunny'
import type { CompressionOptions, CompressionProgress, CompressionResult, OutputFormat } from '@/core/types/compression.types'
import type { VideoMetadata } from '@/core/types/video.types'
import { calculateScaledResolution } from '@/core/utils/resolution_calculator'
import { calculateBitrates } from '@/core/utils/bitrate_calculator'
import { calculateSavings } from '@/core/utils/file_size_formatter'

export async function compressVideoWithWebCodecs(
  file: File,
  metadata: VideoMetadata,
  options: CompressionOptions,
  onProgress: (progress: CompressionProgress) => void,
  signal?: AbortSignal
): Promise<CompressionResult> {
  if (signal?.aborted) {
    throw new DOMException('Compression aborted', 'AbortError')
  }

  const totalDuration = Math.max(0.1, metadata.duration)
  const scaled = calculateScaledResolution(
    metadata.width,
    metadata.height,
    options.resolutionPreset,
    options.customScale
  )

  const bitrates = calculateBitrates({
    mode: options.mode,
    durationSeconds: totalDuration,
    targetSizeMb: options.targetSizeMb,
    qualityCrf: options.qualityCrf,
    manualVideoBitrateKbps: options.manualVideoBitrateKbps,
    audioOption: options.audioOption,
    audioBitrateKbps: options.audioBitrateKbps,
    targetWidth: scaled.width,
    targetHeight: scaled.height,
    resolutionPreset: options.resolutionPreset,
    originalSizeBytes: metadata.size,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    customScale: options.customScale,
  })

  const input = new Input({
    source: new BlobSource(file),
    formats: ALL_FORMATS,
  })

  const primaryAudio = await input.getPrimaryAudioTrack()
  const hasAudio = primaryAudio !== null

  let outputFormat: OutputFormat = options.format

  if (hasAudio && options.audioOption === 'keep') {
    const sourceAudioCodec = await primaryAudio.getCodec()
    // Align container format with source audio codec so packets can be copied 1:1 losslessly without re-encoding
    if (sourceAudioCodec === 'opus') {
      outputFormat = options.format === 'mp4' ? 'mp4' : 'webm'
    } else {
      // AAC, MP3, AC3, FLAC require MP4 container to preserve packets losslessly
      outputFormat = 'mp4'
    }
  }

  // Only fall back to WebM if audio is muted or Opus-based, because WebM strictly rejects AAC audio
  if (outputFormat === 'mp4' && (!hasAudio || options.audioOption === 'mute')) {
    const supportsAvc = await canEncodeVideo('avc', {
      width: scaled.width,
      height: scaled.height,
    })
    if (!supportsAvc) {
      outputFormat = 'webm'
    }
  }

  const format = outputFormat === 'mp4' ? new Mp4OutputFormat() : new WebMOutputFormat()
  const target = new BufferTarget()
  const output = new Output({
    format,
    target,
  })

  // Audio stream is 100% untouched passthrough unless explicitly muted by user
  const audioConfig = options.audioOption === 'mute' || !hasAudio ? { discard: true } : undefined

  const conversion = await Conversion.init({
    input,
    output,
    tracks: 'primary',
    copy: {
      mode: 'preferred',
      shiftTolerance: Infinity,
      boundaryTolerance: Infinity,
    },
    video: {
      width: scaled.width,
      height: scaled.height,
      fit: 'contain',
      frameRate: options.targetFps || undefined,
      quality: new Quality({
        bitrate: bitrates.videoBitrateBps,
        bitrateMode: 'variable',
      }),
      forceTranscode: true,
    },
    audio: audioConfig,
  })

  if (!conversion.isValid) {
    const reasons = conversion.discardedTracks.map((t) => `${t.track.type}: ${t.reason}`).join(', ')
    throw new Error(`Incompatible format configuration: ${reasons || 'Unsupported tracks'}`)
  }

  const discardedVideo = conversion.discardedTracks.find((t) => t.track.type === 'video')
  if (discardedVideo) {
    throw new Error(`Video track could not be processed: ${discardedVideo.reason}`)
  }

  const discardedAudio = conversion.discardedTracks.find((t) => t.track.type === 'audio')
  if (hasAudio && options.audioOption !== 'mute' && discardedAudio) {
    throw new Error(`Audio track could not be preserved: ${discardedAudio.reason}`)
  }

  const startTimeReal = performance.now()

  conversion.onProgress = (progress: number, processedTime: number) => {
    const percentage = Math.min(99, Number((progress * 100).toFixed(1)))
    const elapsed = (performance.now() - startTimeReal) / 1000
    const estimatedTotal = progress > 0 ? elapsed / progress : 0
    const remSec = Math.max(0, Math.round(estimatedTotal - elapsed))

    onProgress({
      percentage,
      processedSeconds: Number(processedTime.toFixed(1)),
      totalSeconds: totalDuration,
      currentFps: options.targetFps || 30,
      estimatedRemainingSeconds: remSec,
    })
  }

  const abortHandler = () => {
    conversion.cancel().catch(() => {})
  }

  if (signal) {
    signal.addEventListener('abort', abortHandler, { once: true })
  }

  try {
    await conversion.execute()
  } catch (err) {
    if (signal?.aborted || err instanceof ConversionCanceledError) {
      throw new DOMException('Compression aborted', 'AbortError')
    }
    throw err
  } finally {
    if (signal) {
      signal.removeEventListener('abort', abortHandler)
    }
  }

  const buffer = target.buffer
  if (!buffer) {
    throw new Error('Conversion completed without producing an output buffer')
  }

  const finalBlob = new Blob([buffer], { type: format.mimeType })
  const compressedSize = finalBlob.size
  const { savedBytes } = calculateSavings(metadata.size, compressedSize)
  const finalUrl = URL.createObjectURL(finalBlob)

  return {
    blob: finalBlob,
    url: finalUrl,
    originalSize: metadata.size,
    compressedSize,
    compressionRatio: Number((metadata.size / Math.max(1, compressedSize)).toFixed(1)),
    savedBytes,
    duration: totalDuration,
    width: scaled.width,
    height: scaled.height,
    format: outputFormat,
  }
}
