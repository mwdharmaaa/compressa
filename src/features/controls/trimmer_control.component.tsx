import { formatDuration } from '@/core/utils/time_formatter'
import { Scissors, RotateCcw } from 'lucide-react'

export interface TrimmerControlProps {
  duration: number
  startTime: number
  endTime: number
  onChangeRange: (start: number, end: number) => void
}

export function TrimmerControl({
  duration,
  startTime,
  endTime,
  onChangeRange,
}: TrimmerControlProps) {
  const effectiveEnd = endTime > 0 ? Math.min(duration, endTime) : duration
  const clipDuration = Math.max(0, effectiveEnd - startTime)
  const isFullDuration = startTime <= 0.05 && effectiveEnd >= duration - 0.05

  return (
    <div className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Scissors className="w-3.5 h-3.5 text-zinc-400" />
            <span>Trim Video Duration</span>
          </div>
          {isFullDuration ? (
            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.2 rounded-full">
              Full Video (100%)
            </span>
          ) : (
            <span className="text-[10px] font-medium text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.2 rounded-full">
              Trimmed Clip
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isFullDuration && (
            <button
              type="button"
              onClick={() => onChangeRange(0, duration)}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-750 px-2 py-0.5 rounded border border-zinc-700 transition-colors cursor-pointer"
              title="Reset to original full video duration"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset Full</span>
            </button>
          )}
          <span className="text-xs font-mono font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60">
            {formatDuration(clipDuration)} / {formatDuration(duration)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Start</span>
            <span className="font-mono text-zinc-200">{formatDuration(startTime)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, effectiveEnd - 0.5)}
            step="0.1"
            value={startTime}
            onChange={(e) => onChangeRange(Number(e.target.value), effectiveEnd)}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>End</span>
            <span className="font-mono text-zinc-200">{formatDuration(effectiveEnd)}</span>
          </div>
          <input
            type="range"
            min={Math.min(duration, startTime + 0.5)}
            max={duration}
            step="0.1"
            value={effectiveEnd}
            onChange={(e) => onChangeRange(startTime, Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
