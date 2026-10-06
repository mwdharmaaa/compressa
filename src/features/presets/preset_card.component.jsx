import { Badge } from '@/components/ui/badge.component'

export function PresetCard({ preset, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-zinc-850/90 border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50'
          : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-sm font-semibold text-zinc-100">{preset.label}</span>
        {preset.badge && (
          <Badge variant={isSelected ? 'blue' : 'neutral'} size="sm">
            {preset.badge}
          </Badge>
        )}
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{preset.description}</p>
    </button>
  )
}
