import { useState, useEffect, useRef } from 'react'
import type { VideoFileItem } from '@/core/types/video.types'
import type { CompressionOptions, CompressionProgress, CompressionResult } from '@/core/types/compression.types'
import { detectSupportedCodecs } from '@/core/engine/codec_support_detector'
import { extractVideoMetadata } from '@/core/engine/video_metadata_extractor'
import { compressVideo } from '@/core/engine/video_compressor.engine'
import { Header } from '@/components/layout/header.component'
import { Footer } from '@/components/layout/footer.component'
import { Dropzone } from '@/features/upload/dropzone.component'
import { HeroShowcase } from '@/features/studio/hero_showcase.component'
import { VideoInfoBar } from '@/features/studio/video_info_bar.component'
import { BatchQueue } from '@/features/queue/batch_queue.component'
import { CompressionSettings } from '@/features/studio/compression_settings.component'
import { ProgressCard } from '@/features/processing/progress_card.component'
import { CompressionMetrics } from '@/features/results/compression_metrics.component'
import { VideoComparison } from '@/features/player/video_comparison.component'
import { ExportAction } from '@/features/results/export_action.component'

const DEFAULT_OPTIONS: CompressionOptions = {
  mode: 'preset',
  targetSizeMb: 16,
  resolutionPreset: 'original',
  customScale: 0.75,
  targetFps: 0,
  qualityCrf: 28,
  manualVideoBitrateKbps: 1500,
  audioOption: 'keep',
  audioBitrateKbps: 128,
  format: 'mp4',
  speedMultiplier: 1.5,
  timeRange: { start: 0, end: 0 },
}

export function App() {
  const [items, setItems] = useState<VideoFileItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS)
  const [supportsMp4, setSupportsMp4] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<CompressionProgress | null>(null)
  const [activeResult, setActiveResult] = useState<CompressionResult | null>(null)
  const abortCtrlRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const codecs = detectSupportedCodecs()
    setSupportsMp4(codecs.supportsMp4)
    if (!codecs.supportsMp4) {
      setOptions((prev) => ({ ...prev, format: 'webm' }))
    }
  }, [])

  const handleFilesSelected = async (files: File[]) => {
    const newItems: VideoFileItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      metadata: null,
      status: 'analyzing',
    }))

    setItems((prev) => [...prev, ...newItems])
    if (!activeId && newItems.length > 0) setActiveId(newItems[0].id)

    for (const item of newItems) {
      try {
        const meta = await extractVideoMetadata(item.file)
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, metadata: meta, status: 'ready' } : i))
        )
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', errorMessage: err instanceof Error ? err.message : 'Error' }
              : i
          )
        )
      }
    }
  }

  const activeItem = items.find((i) => i.id === activeId) ?? null

  const handleStartCompress = async (targetItem: VideoFileItem = activeItem!) => {
    if (!targetItem?.metadata) return
    setIsProcessing(true)
    setProgress(null)
    setActiveResult(null)
    abortCtrlRef.current = new AbortController()

    try {
      const res = await compressVideo(
        targetItem.file,
        targetItem.metadata,
        options,
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

  const handleProcessAll = async () => {
    for (const item of items) {
      if (item.metadata && item.status !== 'completed') {
        setActiveId(item.id)
        await handleStartCompress(item)
      }
    }
  }

  const handleCancel = () => {
    abortCtrlRef.current?.abort()
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {items.length === 0 ? (
          <div className="flex flex-col gap-4 py-8">
            <div className="text-center max-w-xl mx-auto mb-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Compress Videos with Zero Uploads
              </h1>
              <p className="text-sm text-zinc-400">
                Ultra-fast, in-browser compression studio. Reduce video file sizes for Discord, Email, and WhatsApp while keeping pristine visual fidelity.
              </p>
            </div>
            <Dropzone onFilesSelected={handleFilesSelected} />
            <HeroShowcase />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeItem?.metadata && (
              <VideoInfoBar
                metadata={activeItem.metadata}
                disabled={isProcessing}
                onRemove={() => {
                  const filtered = items.filter((i) => i.id !== activeItem.id)
                  setItems(filtered)
                  setActiveId(filtered[0]?.id ?? null)
                  setActiveResult(null)
                }}
              />
            )}

            {items.length > 1 && (
              <BatchQueue
                items={items}
                activeId={activeId}
                isProcessing={isProcessing}
                onSelectItem={(id) => {
                  setActiveId(id)
                  const selected = items.find((i) => i.id === id)
                  if (selected?.resultUrl) {
                    setActiveResult({
                      blob: selected.resultBlob!,
                      url: selected.resultUrl,
                      originalSize: selected.metadata!.size,
                      compressedSize: selected.resultSize!,
                      compressionRatio: Number((selected.metadata!.size / selected.resultSize!).toFixed(1)),
                      savedBytes: selected.metadata!.size - selected.resultSize!,
                      duration: selected.metadata!.duration,
                      width: selected.metadata!.width,
                      height: selected.metadata!.height,
                      format: options.format,
                    })
                  } else {
                    setActiveResult(null)
                  }
                }}
                onRemoveItem={(id) => {
                  const filtered = items.filter((i) => i.id !== id)
                  setItems(filtered)
                  if (activeId === id) setActiveId(filtered[0]?.id ?? null)
                }}
                onProcessAll={handleProcessAll}
              />
            )}

            {isProcessing && (
              <ProgressCard
                progress={progress}
                fileName={activeItem?.file.name ?? ''}
                onCancel={handleCancel}
              />
            )}

            {activeResult && activeItem && (
              <div className="flex flex-col gap-5">
                <CompressionMetrics result={activeResult} />
                <VideoComparison
                  originalFile={activeItem.file}
                  compressedUrl={activeResult.url}
                  compressedResolution={{ width: activeResult.width, height: activeResult.height }}
                  originalResolution={{
                    width: activeItem.metadata?.width ?? 1280,
                    height: activeItem.metadata?.height ?? 720,
                  }}
                />
                <ExportAction
                  originalFileName={activeItem.file.name}
                  result={activeResult}
                  onReset={() => {
                    setActiveResult(null)
                    setItems([])
                    setActiveId(null)
                  }}
                />
              </div>
            )}

            {!isProcessing && !activeResult && activeItem?.metadata && (
              <CompressionSettings
                metadata={activeItem.metadata}
                options={options}
                supportsMp4={supportsMp4}
                isProcessing={isProcessing}
                onChangeOptions={setOptions}
                onStartCompress={() => handleStartCompress(activeItem)}
              />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
