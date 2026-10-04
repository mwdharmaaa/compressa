import type { ResolutionPreset } from '@/core/types/compression.types'
import { getResolutionEstimates } from '@/core/utils/bitrate_calculator'
import { Check, Sparkles } from 'lucide-react'

export interface ResolutionPresetSelectorProps {
  originalWidth: number
  originalHeight: number
  duration: number
  originalSize: number
  preset: ResolutionPreset
  customScale: number
  onSelectPreset: (preset: ResolutionPreset) => void
  onChangeCustomScale: (scale: number) => void
}

export function ResolutionPresetSelector({
  originalWidth,
  originalHeight,
  duration,
  originalSize,
  preset,
  customScale,
  onSelectPreset,
  onChangeCustomScale,
}: ResolutionPresetSelectorProps) {
  const estimates = getResolutionEstimates(originalWidth, originalHeight, duration, originalSize)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-zinc-200">Select Target Resolution</label>
          <p className="text-[11px] text-zinc-400">File size automatically adjusts based on chosen resolution</p>
        </div>
        <span className="text-[11px] font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded-md">
          Resolution First
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {estimates.map((item) => {
          const isSelected = preset === item.preset
          return (
            <button
              key={item.preset}
              type="button"
              onClick={() => onSelectPreset(item.preset)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-zinc-850/90 border-blue-500/80 shadow-[0_0_14px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50'
                  : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850/70 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-100">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${
                        item.badge === 'Popular'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-zinc-700 bg-zinc-800/50'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              <div className="flex items-baseline justify-between w-full pt-1 border-t border-zinc-800/60">
                <span className="text-[11px] font-mono text-zinc-400">
                  {item.width} × {item.height}
                </span>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-zinc-100">
                    ~{item.estimatedSizeMb} MB
                  </span>
                  {item.percentSavings > 0 && (
                    <span className="ml-1.5 text-[10px] font-mono text-emerald-400 font-medium">
                      -{item.percentSavings}%
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}

        {/* Custom Scale Card */}
        <button
          type="button"
          onClick={() => onSelectPreset('custom')}
          className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
            preset === 'custom'
              ? 'bg-zinc-850/90 border-blue-500/80 shadow-[0_0_14px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50'
              : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850/70 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-start justify-between w-full mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-zinc-100">Custom Scale</span>
            </div>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                preset === 'custom'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'border-zinc-700 bg-zinc-800/50'
              }`}
            >
              {preset === 'custom' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
          </div>
          <div className="flex items-baseline justify-between w-full pt-1 border-t border-zinc-800/60">
            <span className="text-[11px] text-zinc-400">Variable %</span>
            <span className="text-xs font-mono font-semibold text-blue-400">
              {Math.round(customScale * 100)}%
            </span>
          </div>
        </button>
      </div>

      {preset === 'custom' && (
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">Custom Downscaling Ratio</span>
            <span className="text-xs font-mono text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
              {Math.round(originalWidth * customScale)} × {Math.round(originalHeight * customScale)} (
              {Math.round(customScale * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={customScale}
            onChange={(e) => onChangeCustomScale(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      )}
    </div>
  )
}
