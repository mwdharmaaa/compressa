import { useState, useRef, useEffect, useMemo } from 'react'
import { Tabs } from '@/components/ui/tabs.component'
import { Eye } from 'lucide-react'

export function VideoComparison({
  originalFile,
  compressedUrl,
  compressedResolution,
  originalResolution,
}) {
  const [viewMode, setViewMode] = useState('compressed')
  const compVideoRef = useRef(null)
  const origVideoRef = useRef(null)

  const origUrl = useMemo(() => URL.createObjectURL(originalFile), [originalFile])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(origUrl)
    }
  }, [origUrl])

  const tabItems = [
    { id: 'compressed', label: 'Compressed Output' },
    { id: 'original', label: 'Original Source' },
    { id: 'side-by-side', label: 'Side-by-Side' },
  ]

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
          <Eye className="w-4 h-4 text-zinc-400" />
          <span>Video Quality Inspector</span>
        </div>

        <Tabs items={tabItems} activeId={viewMode} onChange={setViewMode} size="sm" />
      </div>

      <div className="relative rounded-lg overflow-hidden bg-black/60 border border-zinc-800 flex items-center justify-center min-h-[240px]">
        {viewMode === 'compressed' && (
          <div className="relative w-full flex flex-col items-center">
            <span className="absolute top-2 left-2 z-10 text-[10px] font-mono bg-zinc-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/60">
              Compressed ({compressedResolution.width}×{compressedResolution.height})
            </span>
            <video
              ref={compVideoRef}
              src={compressedUrl}
              controls
              playsInline
              className="max-h-[380px] w-auto max-w-full rounded"
            />
          </div>
        )}

        {viewMode === 'original' && origUrl && (
          <div className="relative w-full flex flex-col items-center">
            <span className="absolute top-2 left-2 z-10 text-[10px] font-mono bg-zinc-950/80 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
              Original ({originalResolution.width}×{originalResolution.height})
            </span>
            <video
              ref={origVideoRef}
              src={origUrl}
              controls
              playsInline
              className="max-h-[380px] w-auto max-w-full rounded"
            />
          </div>
        )}

        {viewMode === 'side-by-side' && origUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full p-2">
            <div className="relative flex flex-col items-center bg-zinc-950 rounded p-1 border border-zinc-800/80">
              <span className="text-[10px] font-mono text-zinc-400 mb-1">
                Original ({originalResolution.width}×{originalResolution.height})
              </span>
              <video
                src={origUrl}
                controls
                playsInline
                className="max-h-[220px] w-auto max-w-full rounded"
              />
            </div>

            <div className="relative flex flex-col items-center bg-zinc-950 rounded p-1 border border-zinc-800/80">
              <span className="text-[10px] font-mono text-emerald-400 mb-1">
                Compressed ({compressedResolution.width}×{compressedResolution.height})
              </span>
              <video
                src={compressedUrl}
                controls
                playsInline
                className="max-h-[220px] w-auto max-w-full rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
