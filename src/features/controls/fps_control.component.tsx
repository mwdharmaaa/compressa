export interface FpsControlProps {
  targetFps: number
  onChange: (fps: number) => void
}

export function FpsControl({ targetFps, onChange }: FpsControlProps) {
  const options = [
    { value: 0, label: 'Auto' },
    { value: 60, label: '60 FPS' },
    { value: 30, label: '30 FPS' },
    { value: 24, label: '24 FPS' },
    { value: 15, label: '15 FPS' },
  ]

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">Framerate Limit</label>
        <span className="text-xs font-mono font-medium text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
          {targetFps === 0 ? 'Original' : `${targetFps} FPS`}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer text-center ${
              targetFps === opt.value
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
