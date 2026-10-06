import { calculateScaledResolution } from '@/core/utils/resolution_calculator'

export function ResolutionControl({
  originalWidth,
  originalHeight,
  preset,
  customScale,
  onChangePreset,
  onChangeCustomScale,
}) {
  const options = [
    { id: 'original', label: 'Original' },
    { id: '1080p', label: '1080p' },
    { id: '720p', label: '720p' },
    { id: '480p', label: '480p' },
    { id: '360p', label: '360p' },
    { id: 'custom', label: 'Custom' },
  ]

  const scaled = calculateScaledResolution(originalWidth, originalHeight, preset, customScale)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">Resolution Scale</label>
        <span className="text-xs font-mono font-medium text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
          {scaled.width} × {scaled.height}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChangePreset(opt.id)}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              preset === opt.id
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div className="flex items-center gap-3 pt-1">
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={customScale}
            onChange={(e) => onChangeCustomScale(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-mono text-zinc-300 w-12 text-right">
            {Math.round(customScale * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
