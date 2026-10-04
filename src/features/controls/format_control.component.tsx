import type { OutputFormat } from '@/core/types/compression.types'
import { ShieldCheck } from 'lucide-react'

export interface FormatControlProps {
  format: OutputFormat
  supportsMp4: boolean
  onChangeFormat: (format: OutputFormat) => void
}

export function FormatControl({
  format,
  supportsMp4,
  onChangeFormat,
}: FormatControlProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-300">Output Container</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!supportsMp4}
            onClick={() => onChangeFormat('mp4')}
            className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              format === 'mp4'
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
            } ${!supportsMp4 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <span>MP4 (H.264)</span>
            {!supportsMp4 && <span className="block text-[10px] text-zinc-500">Not supported</span>}
          </button>

          <button
            type="button"
            onClick={() => onChangeFormat('webm')}
            className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              format === 'webm'
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
            }`}
          >
            <span>WebM (VP9/VP8)</span>
            <span className="block text-[10px] text-zinc-400">Universal support</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-1.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Duration Integrity Guaranteed</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-snug">
          1:1 native clock synchronization. Video duration is fully preserved without time compression or truncation.
        </p>
      </div>
    </div>
  )
}
