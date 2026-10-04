import type { AudioOption } from '@/core/types/compression.types'
import { Volume2, VolumeX, Music } from 'lucide-react'

export interface AudioControlProps {
  option: AudioOption
  bitrateKbps: number
  onChangeOption: (opt: AudioOption) => void
  onChangeBitrate: (bitrate: number) => void
}

export function AudioControl({
  option,
  bitrateKbps,
  onChangeOption,
  onChangeBitrate,
}: AudioControlProps) {
  const options: { id: AudioOption; label: string; icon: typeof Volume2; desc: string }[] = [
    { id: 'keep', label: 'Original', icon: Volume2, desc: 'Original audio untouched (100% Passthrough)' },
    { id: 'compress', label: 'Compressed', icon: Music, desc: 'Optimized voice/music' },
    { id: 'mute', label: 'Strip Audio', icon: VolumeX, desc: 'Silent video (Maximum saving)' },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-medium text-zinc-300">Audio Optimization</label>
      <div className="grid grid-cols-3 gap-2">
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
              <span className="text-[10px] text-zinc-400">{item.desc}</span>
            </button>
          )
        })}
      </div>

      {option === 'compress' && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-zinc-400">Target Audio Bitrate</span>
          <select
            value={bitrateKbps}
            onChange={(e) => onChangeBitrate(Number(e.target.value))}
            className="text-xs bg-zinc-850 border border-zinc-700/80 rounded px-2 py-1 text-zinc-200 focus:outline-none"
          >
            <option value={64}>64 kbps (Voice / Low)</option>
            <option value={96}>96 kbps (Balanced)</option>
            <option value={128}>128 kbps (Standard)</option>
          </select>
        </div>
      )}
    </div>
  )
}
