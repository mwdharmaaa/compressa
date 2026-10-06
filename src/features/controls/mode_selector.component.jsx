import { Monitor, Target, Sliders, Cpu } from 'lucide-react'

export function ModeSelector({ mode, onChange }) {
  const modes = [
    {
      id: 'resolution',
      label: 'By Resolution',
      icon: Monitor,
      desc: 'Smart size adapted to 1080p, 720p, 480p, 360p',
    },
    {
      id: 'preset',
      label: 'Target File Size',
      icon: Target,
      desc: 'Set exact MB limit (Discord, Email, WhatsApp)',
    },
    {
      id: 'quality',
      label: 'Quality Presets',
      icon: Sliders,
      desc: 'Balanced compression based on quality factor',
    },
    {
      id: 'manual',
      label: 'Custom Bitrate',
      icon: Cpu,
      desc: 'Fine-tune exact kbps for video & audio',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      {modes.map((item) => {
        const isSelected = mode === item.id
        const Icon = item.icon
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
              isSelected
                ? 'bg-zinc-850/90 border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.12)] ring-1 ring-blue-500/40'
                : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-850/70 hover:border-zinc-700'
            }`}
          >
            <div
              className={`p-2 rounded-lg border ${
                isSelected
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-zinc-800 border-zinc-700/60 text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-100 mb-0.5">{item.label}</div>
              <div className="text-[11px] text-zinc-400 leading-tight">{item.desc}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
