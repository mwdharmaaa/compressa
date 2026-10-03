import JSZip from 'jszip'
import type { VideoFileItem } from '@/core/types/video.types'
import { formatFileSize } from '@/core/utils/file_size_formatter'
import { Button } from '@/components/ui/button.component'
import { Badge } from '@/components/ui/badge.component'
import { Trash2, Archive, Play, CheckCircle } from 'lucide-react'

export interface BatchQueueProps {
  items: VideoFileItem[]
  activeId: string | null
  onSelectItem: (id: string) => void
  onRemoveItem: (id: string) => void
  onProcessAll: () => void
  isProcessing: boolean
}

export function BatchQueue({
  items,
  activeId,
  onSelectItem,
  onRemoveItem,
  onProcessAll,
  isProcessing,
}: BatchQueueProps) {
  const completedCount = items.filter((i) => i.status === 'completed' && i.resultBlob).length

  const handleDownloadAllZip = async () => {
    const zip = new JSZip()
    for (const item of items) {
      if (item.status === 'completed' && item.resultBlob) {
        const baseName = item.file.name.replace(/\.[^/.]+$/, '')
        const extension = item.resultBlob.type.includes('mp4') ? 'mp4' : 'webm'
        zip.file(`${baseName}_compressed.${extension}`, item.resultBlob)
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipUrl = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = zipUrl
    a.download = `compressa_batch_${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(zipUrl)
  }

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-200">
            Batch Queue ({items.length} {items.length === 1 ? 'video' : 'videos'})
          </span>
          {completedCount > 0 && (
            <Badge variant="green" size="sm">
              {completedCount} Ready
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 1 && (
            <Button variant="secondary" size="sm" onClick={handleDownloadAllZip} className="gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              Download ZIP
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onProcessAll}
            disabled={isProcessing}
            isLoading={isProcessing}
            className="gap-1.5 text-zinc-950 font-semibold"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Compress All
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-850 border-blue-500/60'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-850/60'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {item.metadata?.thumbnailUrl ? (
                  <img
                    src={item.metadata.thumbnailUrl}
                    alt=""
                    className="w-10 h-7 object-cover rounded border border-zinc-700/60 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-7 bg-zinc-800 rounded flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-zinc-500 font-mono">VID</span>
                  </div>
                )}

                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-zinc-200 truncate">{item.file.name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {formatFileSize(item.file.size)}
                    {item.resultSize && ` → ${formatFileSize(item.resultSize)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                {item.status === 'compressing' && (
                  <span className="text-[10px] font-mono text-blue-400 animate-pulse">
                    {item.progress?.toFixed(0) ?? 0}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveItem(item.id)
                  }}
                  disabled={isProcessing}
                  className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
