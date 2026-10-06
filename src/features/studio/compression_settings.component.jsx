import { ModeSelector } from '@/features/controls/mode_selector.component'
import { ResolutionPresetSelector } from '@/features/controls/resolution_preset_selector.component'
import { getTargetSizePresets } from '@/features/presets/target_size_presets'
import { PresetCard } from '@/features/presets/preset_card.component'
import { ResolutionControl } from '@/features/controls/resolution_control.component'
import { FpsControl } from '@/features/controls/fps_control.component'
import { AudioControl } from '@/features/controls/audio_control.component'
import { FormatControl } from '@/features/controls/format_control.component'
import { Slider } from '@/components/ui/slider.component'
import { Button } from '@/components/ui/button.component'
import { Play } from 'lucide-react'

export function CompressionSettings({
  metadata,
  options,
  supportsMp4,
  isProcessing,
  onChangeOptions,
  onStartCompress,
}) {
  const targetPresets = getTargetSizePresets(metadata.size)
  const originalMb = Number((metadata.size / (1024 * 1024)).toFixed(1))
  const maxCustomMb = Math.max(2, Math.round(originalMb * 0.95))
  const minCustomMb = Math.max(1, Math.round(originalMb * 0.08))

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
      <ModeSelector
        mode={options.mode}
        onChange={(m) => onChangeOptions((prev) => ({ ...prev, mode: m }))}
      />

      {options.mode === 'resolution' && (
        <ResolutionPresetSelector
          originalWidth={metadata.width}
          originalHeight={metadata.height}
          duration={metadata.duration}
          originalSize={metadata.size}
          preset={options.resolutionPreset}
          customScale={options.customScale}
          onSelectPreset={(p) => onChangeOptions((prev) => ({ ...prev, resolutionPreset: p }))}
          onChangeCustomScale={(s) => onChangeOptions((prev) => ({ ...prev, customScale: s }))}
        />
      )}

      {options.mode === 'preset' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">Choose Target Size</label>
            <span className="text-[11px] font-mono text-zinc-400">
              Source: {originalMb} MB
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {targetPresets.map((p) => (
              <PresetCard
                key={p.id}
                preset={p}
                isSelected={options.targetSizeMb === p.targetSizeMb}
                onSelect={(selected) =>
                  onChangeOptions((prev) => ({ ...prev, targetSizeMb: selected.targetSizeMb }))
                }
              />
            ))}
          </div>

          <div className="pt-2">
            <Slider
              label="Custom Target Size"
              value={Math.min(maxCustomMb, Math.max(minCustomMb, options.targetSizeMb ?? Math.round(originalMb * 0.5)))}
              onChange={(val) => onChangeOptions((prev) => ({ ...prev, targetSizeMb: val }))}
              min={minCustomMb}
              max={maxCustomMb}
              step={1}
              unit=" MB"
              description={`Target cap between ${minCustomMb} MB and ${maxCustomMb} MB (< original ${originalMb} MB)`}
            />
          </div>
        </div>
      )}

      {options.mode === 'quality' && (
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <Slider
            label="Constant Rate Factor (CRF)"
            value={options.qualityCrf}
            onChange={(val) => onChangeOptions((prev) => ({ ...prev, qualityCrf: val }))}
            min={18}
            max={38}
            step={1}
            displayValue={`CRF ${options.qualityCrf} (${
              options.qualityCrf <= 22
                ? 'High Quality'
                : options.qualityCrf <= 30
                ? 'Balanced'
                : 'High Compression'
            })`}
            description="Lower values produce higher visual fidelity; higher values yield smaller files"
          />
        </div>
      )}

      {options.mode === 'manual' && (
        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <Slider
            label="Video Bitrate"
            value={options.manualVideoBitrateKbps}
            onChange={(val) =>
              onChangeOptions((prev) => ({ ...prev, manualVideoBitrateKbps: val }))
            }
            min={150}
            max={10000}
            step={50}
            unit=" kbps"
            displayValue={`${options.manualVideoBitrateKbps} kbps`}
            description="Target video data rate in kilobits per second"
          />
        </div>
      )}

      {options.mode !== 'resolution' && (
        <ResolutionControl
          originalWidth={metadata.width}
          originalHeight={metadata.height}
          preset={options.resolutionPreset}
          customScale={options.customScale}
          onChangePreset={(p) => onChangeOptions((prev) => ({ ...prev, resolutionPreset: p }))}
          onChangeCustomScale={(s) => onChangeOptions((prev) => ({ ...prev, customScale: s }))}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FpsControl
          targetFps={options.targetFps}
          onChange={(fps) => onChangeOptions((prev) => ({ ...prev, targetFps: fps }))}
        />
        <AudioControl
          option={options.audioOption}
          onChangeOption={(opt) => onChangeOptions((prev) => ({ ...prev, audioOption: opt }))}
        />
      </div>

      <FormatControl
        format={options.format}
        supportsMp4={supportsMp4}
        onChangeFormat={(fmt) => onChangeOptions((prev) => ({ ...prev, format: fmt }))}
      />

      <Button
        variant="primary"
        size="lg"
        onClick={onStartCompress}
        disabled={isProcessing}
        isLoading={isProcessing}
        className="w-full gap-2 text-zinc-950 font-semibold mt-2"
      >
        <Play className="w-4 h-4 fill-current" />
        Compress Video Now
      </Button>
    </div>
  )
}
