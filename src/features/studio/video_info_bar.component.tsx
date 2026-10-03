import type { VideoMetadata } from '@/core/types/video.types'
import { formatFileSize } from '@/core/utils/file_size_formatter'
import { formatDuration } from '@/core/utils/time_formatter'
import { Film, Clock, HardDrive, Maximize2, Trash2 } from 'lucide-react'

export interface VideoInfoBarProps {
  metadata: VideoMetadata
  onRemove: () => void
  disabled?: boolean
}

export function VideoInfoBar({ metadata, onRemove, disabled = false }: VideoInfoBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
      <div className="flex items-center gap-3 overflow-hidden">
        {metadata.thumbnailUrl ? (
          <img
            src={metadata.thumbnailUrl}
            alt=""
            className="w-16 h-10 object-cover rounded-lg border border-zinc-700/60 shrink-0"
          />
        ) : (
          <div className="w-16 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
            <Film className="w-5 h-5 text-zinc-400" />
          </div>
        )}

        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-zinc-100 truncate">{metadata.name}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-zinc-500" />
              {formatFileSize(metadata.size)}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3 text-zinc-500" />
              {metadata.width} × {metadata.height}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              {formatDuration(metadata.duration)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        className="self-end sm:self-center flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-900/50 bg-zinc-950/60 transition-all cursor-pointer disabled:opacity-40"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Remove
      </button>
    </div>
  )
}
