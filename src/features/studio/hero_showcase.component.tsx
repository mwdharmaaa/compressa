import { Shield, Zap, Layers, Sliders } from 'lucide-react'

export function HeroShowcase() {
  const features = [
    {
      icon: Shield,
      title: '100% In-Browser Privacy',
      desc: 'Videos are decoded and compressed locally in your browser memory. Nothing is ever uploaded to external servers.',
    },
    {
      icon: Zap,
      title: 'Hardware Accelerated',
      desc: 'Utilizes native browser Canvas and MediaStream codecs for GPU-accelerated video rendering and decimation.',
    },
    {
      icon: Sliders,
      title: 'Target Size & CRF Modes',
      desc: 'Target exact file boundaries for Discord, WhatsApp, and Email, or fine-tune quality with CRF and bitrate sliders.',
    },
    {
      icon: Layers,
      title: 'Batch Multi-Queue',
      desc: 'Queue multiple video files, batch process in sequence, and export individual clips or a single ZIP archive.',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
      {features.map((f, i) => {
        const Icon = f.icon
        return (
          <div
            key={i}
            className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <Icon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-zinc-100">{f.title}</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{f.desc}</p>
          </div>
        )
      })}
    </div>
  )
}
