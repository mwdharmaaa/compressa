import { formatDuration } from '@/core/utils/time_formatter'
import { Scissors } from 'lucide-react'

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
  const effectiveEnd = endTime > 0 ? endTime : duration
  const clipDuration = Math.max(0, effectiveEnd - startTime)

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
          <Scissors className="w-3.5 h-3.5 text-zinc-400" />
          <span>Trim Video Duration</span>
        </div>
        <span className="text-xs font-mono font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700/60">
          Selected: {formatDuration(clipDuration)} / {formatDuration(duration)}
        </span>
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
