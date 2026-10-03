export interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  displayValue?: string
  description?: string
  disabled?: boolean
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  displayValue,
  description,
  disabled = false,
}: SliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">{label}</label>
        <span className="text-xs font-mono font-medium text-zinc-200 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
          {displayValue ?? `${value}${unit}`}
        </span>
      </div>

      <div className="relative flex items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${percentage}%, #27272a ${percentage}%)`,
          }}
        />
      </div>

      {description && <p className="text-[11px] text-zinc-500">{description}</p>}
    </div>
  )
}
