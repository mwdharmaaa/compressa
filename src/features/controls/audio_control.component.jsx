import { Volume2, VolumeX, ShieldCheck } from 'lucide-react'

export function AudioControl({
  option,
  onChangeOption,
}) {
  const options = [
    {
      id: 'keep',
      label: 'Original (Lossless)',
      icon: Volume2,
      desc: 'Bit-for-bit stream copy, 100% untouched without re-encoding',
    },
    {
      id: 'mute',
      label: 'Strip Audio',
      icon: VolumeX,
      desc: 'Silent video output for smaller file size',
    },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300">Audio Handling</label>
        <span className="text-[10px] text-zinc-400 font-mono">Stream Passthrough</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((item) => {
          const isSelected = option === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeOption(item.id)}
              className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-zinc-850 text-zinc-100 border-zinc-600 shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span className="text-xs font-semibold text-zinc-100">{item.label}</span>
              </div>
              <span className="text-[10px] text-zinc-400 leading-tight">{item.desc}</span>
            </button>
          )
        })}
      </div>

      {option === 'keep' && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Audio packets copied 1:1 without transcoding. Original fidelity preserved.</span>
        </div>
      )}
    </div>
  )
}
