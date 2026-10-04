import { useState } from 'react'
import type { CompressionOptions } from '@/core/types/compression.types'
import { detectSupportedCodecs } from '@/core/engine/codec_support_detector'
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
import { useVideoQueue } from '@/features/studio/hooks/use_video_queue.hook'
import { useCompressionJob } from '@/features/studio/hooks/use_compression_job.hook'

const DEFAULT_OPTIONS: CompressionOptions = {
  mode: 'resolution',
  targetSizeMb: 16,
  resolutionPreset: '720p',
  customScale: 0.75,
  targetFps: 0,
  qualityCrf: 28,
  manualVideoBitrateKbps: 1500,
  audioOption: 'keep',
  audioBitrateKbps: 128,
  format: 'mp4',
  timeRange: { start: 0, end: 0 },
}

export function App() {
  const [codecs] = useState(() => detectSupportedCodecs())
  const [options, setOptions] = useState<CompressionOptions>(() => ({
    ...DEFAULT_OPTIONS,
    format: codecs.recommendedFormat,
  }))

  const { items, activeId, activeItem, setItems, setActiveId, handleFilesSelected, removeItem } =
    useVideoQueue()

  const {
    isProcessing,
    progress,
    activeResult,
    setActiveResult,
    handleStartCompress,
    handleProcessAll,
    handleCancel,
  } = useCompressionJob(setItems, setActiveId)

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
                  removeItem(activeItem.id)
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
                onRemoveItem={removeItem}
                onProcessAll={() => handleProcessAll(items, options)}
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
                options={{
                  ...options,
                  timeRange: {
                    start: options.timeRange.start,
                    end:
                      options.timeRange.end > 0 && options.timeRange.end <= activeItem.metadata.duration
                        ? options.timeRange.end
                        : activeItem.metadata.duration,
                  },
                }}
                supportsMp4={codecs.supportsMp4}
                isProcessing={isProcessing}
                onChangeOptions={setOptions}
                onStartCompress={() => handleStartCompress(activeItem, options)}
              />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
