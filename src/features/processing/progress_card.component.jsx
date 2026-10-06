import { ProgressBar } from '@/components/ui/progress_bar.component'
import { Button } from '@/components/ui/button.component'
import { formatDuration } from '@/core/utils/time_formatter'
import { Loader2, XCircle } from 'lucide-react'

export function ProgressCard({ progress, fileName, onCancel }) {
  const percentage = progress?.percentage ?? 0
  const processedSec = progress?.processedSeconds ?? 0
  const totalSec = progress?.totalSeconds ?? 1
  const etaSec = progress?.estimatedRemainingSeconds ?? 0

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-700/60 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">Compressing Video</h4>
            <p className="text-xs text-zinc-400 truncate max-w-xs">{fileName}</p>
          </div>
        </div>

        <Button variant="danger" size="sm" onClick={onCancel} className="gap-1.5">
          <XCircle className="w-3.5 h-3.5" />
          Cancel
        </Button>
      </div>

      <ProgressBar percentage={percentage} showLabel />

      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-center">
        <div>
          <span className="block text-[10px] text-zinc-400 font-medium">Processed</span>
          <span className="text-xs font-mono font-semibold text-zinc-200">
            {formatDuration(processedSec)} / {formatDuration(totalSec)}
          </span>
        </div>

        <div>
          <span className="block text-[10px] text-zinc-400 font-medium">Est. Remaining</span>
          <span className="text-xs font-mono font-semibold text-zinc-200">
            {etaSec > 0 ? `${etaSec}s` : 'Finishing...'}
          </span>
        </div>

        <div>
          <span className="block text-[10px] text-zinc-400 font-medium">Target FPS</span>
          <span className="text-xs font-mono font-semibold text-zinc-200">
            {progress?.currentFps ?? 30} FPS
          </span>
        </div>
      </div>
    </div>
  )
}
