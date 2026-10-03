import type { OutputFormat } from '@/core/types/compression.types'
import { Zap } from 'lucide-react'

export interface FormatControlProps {
  format: OutputFormat
  supportsMp4: boolean
  speedMultiplier: number
  onChangeFormat: (format: OutputFormat) => void
  onChangeSpeed: (speed: number) => void
}

export function FormatControl({
  format,
  supportsMp4,
  speedMultiplier,
  onChangeFormat,
  onChangeSpeed,
}: FormatControlProps) {
  const speeds = [
    { value: 1.0, label: '1× (Normal)' },
    { value: 1.5, label: '1.5×' },
    { value: 2.0, label: '2× (Fast)' },
    { value: 3.0, label: '3× (Turbo)' },
  ]

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

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Encoding Speed</span>
          </div>
          <span className="text-[11px] text-zinc-400">Hardware playback rate</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {speeds.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onChangeSpeed(s.value)}
              className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
                speedMultiplier === s.value
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
