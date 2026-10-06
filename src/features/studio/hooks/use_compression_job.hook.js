import { useState, useRef } from 'react'
import { compressVideo } from '@/core/engine/video_compressor.engine'

export function useCompressionJob(setItems, setActiveId) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(null)
  const [activeResult, setActiveResult] = useState(null)
  const abortCtrlRef = useRef(null)

  const handleStartCompress = async (targetItem, options) => {
    if (!targetItem?.metadata) return
    setIsProcessing(true)
    setProgress(null)
    setActiveResult(null)
    abortCtrlRef.current = new AbortController()

    const originalMb = targetItem.metadata.size / (1024 * 1024)
    const resolvedTargetSizeMb =
      !options.targetSizeMb || options.targetSizeMb >= originalMb
        ? Math.max(1, Math.round(originalMb * 0.5 * 10) / 10)
        : options.targetSizeMb

    const resolvedOptions = {
      ...options,
      targetSizeMb: resolvedTargetSizeMb,
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

  const handleProcessAll = async (items, options) => {
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
