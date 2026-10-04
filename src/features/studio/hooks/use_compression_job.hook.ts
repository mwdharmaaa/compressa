import { useState, useRef } from 'react'
import type { VideoFileItem } from '@/core/types/video.types'
import type { CompressionOptions, CompressionProgress, CompressionResult } from '@/core/types/compression.types'
import { compressVideo } from '@/core/engine/video_compressor.engine'

export function useCompressionJob(
  setItems: React.Dispatch<React.SetStateAction<VideoFileItem[]>>,
  setActiveId: (id: string) => void
) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<CompressionProgress | null>(null)
  const [activeResult, setActiveResult] = useState<CompressionResult | null>(null)
  const abortCtrlRef = useRef<AbortController | null>(null)

  const handleStartCompress = async (targetItem: VideoFileItem, options: CompressionOptions) => {
    if (!targetItem?.metadata) return
    setIsProcessing(true)
    setProgress(null)
    setActiveResult(null)
    abortCtrlRef.current = new AbortController()

    const resolvedOptions: CompressionOptions = {
      ...options,
      timeRange: {
        start: 0,
        end: targetItem.metadata.duration,
      },
    }

    try {
      const res = await compressVideo(
        targetItem.file,
        targetItem.metadata,
        resolvedOptions,
        setProgress,
        abortCtrlRef.current.signal
      )
      setActiveResult(res)
      setItems((prev) =>
        prev.map((i) =>
          i.id === targetItem.id
            ? { ...i, status: 'completed', resultBlob: res.blob, resultSize: res.compressedSize, resultUrl: res.url }
            : i
        )
      )
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === targetItem.id ? { ...i, status: 'ready' } : i))
      )
    } finally {
      setIsProcessing(false)
      abortCtrlRef.current = null
    }
  }

  const handleProcessAll = async (items: VideoFileItem[], options: CompressionOptions) => {
    for (const item of items) {
      if (item.metadata && item.status !== 'completed') {
        setActiveId(item.id)
        await handleStartCompress(item, options)
      }
    }
  }

  const handleCancel = () => {
    abortCtrlRef.current?.abort()
    setIsProcessing(false)
  }

  return {
    isProcessing,
    progress,
    activeResult,
    setActiveResult,
    handleStartCompress,
    handleProcessAll,
    handleCancel,
  }
}
