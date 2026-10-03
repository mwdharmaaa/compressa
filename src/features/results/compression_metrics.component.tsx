import type { CompressionResult } from '@/core/types/compression.types'
import { formatFileSize } from '@/core/utils/file_size_formatter'
import { ArrowDownRight, HardDrive, CheckCircle2 } from 'lucide-react'

export interface CompressionMetricsProps {
  result: CompressionResult
}

export function CompressionMetrics({ result }: CompressionMetricsProps) {
  const percentReduction = Number(
    (((result.originalSize - result.compressedSize) / result.originalSize) * 100).toFixed(1)
  )

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-200">Compression Completed</span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full">
          <ArrowDownRight className="w-3.5 h-3.5" />
          -{Math.max(0, percentReduction)}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-400 font-medium">Original Size</span>
          <p className="text-sm font-mono font-semibold text-zinc-300 mt-0.5">
            {formatFileSize(result.originalSize)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80">
          <span className="text-[10px] text-emerald-400 font-medium">Compressed Size</span>
          <p className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
            {formatFileSize(result.compressedSize)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80">
          <span className="text-[10px] text-blue-400 font-medium">Space Saved</span>
          <p className="text-sm font-mono font-semibold text-blue-400 mt-0.5">
            {formatFileSize(result.savedBytes)}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/80">
          <span className="text-[10px] text-zinc-400 font-medium">Resolution</span>
          <p className="text-sm font-mono font-semibold text-zinc-300 mt-0.5">
            {result.width} × {result.height}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
        <span className="flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-zinc-500" />
          Container: {result.format.toUpperCase()}
        </span>
        <span>Ratio: {result.compressionRatio}× smaller</span>
      </div>
    </div>
  )
}
