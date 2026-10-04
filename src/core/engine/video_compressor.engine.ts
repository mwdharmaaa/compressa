import type { CompressionOptions, CompressionProgress, CompressionResult } from '@/core/types/compression.types'
import type { VideoMetadata } from '@/core/types/video.types'
import { compressVideoWithWebCodecs } from '@/core/engine/webcodecs_compressor'
import { compressVideoWithMediaRecorder } from '@/core/engine/mediarecorder_compressor'

export function isWebCodecsSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'VideoEncoder' in window &&
    'VideoDecoder' in window
  )
}

export async function compressVideo(
  file: File,
  metadata: VideoMetadata,
  options: CompressionOptions,
  onProgress: (progress: CompressionProgress) => void,
  signal?: AbortSignal
): Promise<CompressionResult> {
  if (isWebCodecsSupported()) {
    try {
      return await compressVideoWithWebCodecs(file, metadata, options, onProgress, signal)
    } catch (err) {
      if (signal?.aborted || (err instanceof DOMException && err.name === 'AbortError')) {
        throw err
      }
      console.warn('WebCodecs conversion failed, falling back to MediaRecorder pipeline:', err)
      return await compressVideoWithMediaRecorder(file, metadata, options, onProgress, signal)
    }
  }

  return await compressVideoWithMediaRecorder(file, metadata, options, onProgress, signal)
}
