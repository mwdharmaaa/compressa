import type { AudioOption, CompressionMode, ResolutionPreset } from '@/core/types/compression.types'
import { calculateScaledResolution } from '@/core/utils/resolution_calculator'

export interface BitrateCalculationInput {
  mode: CompressionMode
  durationSeconds: number
  targetSizeMb?: number
  qualityCrf?: number
  manualVideoBitrateKbps?: number
  audioOption: AudioOption
  audioBitrateKbps: number
  targetWidth?: number
  targetHeight?: number
  targetFps?: number
  resolutionPreset?: ResolutionPreset
}

export interface BitrateCalculationResult {
  videoBitrateBps: number
  audioBitrateBps: number
  totalBitrateBps: number
  estimatedSizeMb: number
}

export interface ResolutionEstimateItem {
  preset: ResolutionPreset
  label: string
  sublabel: string
  badge?: string
  width: number
  height: number
  estimatedSizeMb: number
  percentSavings: number
}

const MIN_VIDEO_BITRATE_BPS = 800_000 // 800 kbps minimum
const MAX_VIDEO_BITRATE_BPS = 25_000_000 // 25 Mbps

export function calculateBitrates(input: BitrateCalculationInput): BitrateCalculationResult {
  const duration = Math.max(0.5, input.durationSeconds)

  const audioBitrateBps =
    input.audioOption === 'mute'
      ? 0
      : input.audioOption === 'compress'
      ? Math.max(96_000, (input.audioBitrateKbps || 128) * 1000)
      : Math.max(128_000, (input.audioBitrateKbps || 192) * 1000)

  let videoBitrateBps = 6_000_000

  if (input.mode === 'preset' && input.targetSizeMb && input.targetSizeMb > 0) {
    // 5% margin for container metadata overhead
    const usableBytes = input.targetSizeMb * 1024 * 1024 * 0.95
    const totalBitrateBps = (usableBytes * 8) / duration
    const calculatedVideoBitrate = totalBitrateBps - audioBitrateBps
    videoBitrateBps = Math.min(
      MAX_VIDEO_BITRATE_BPS,
      Math.max(MIN_VIDEO_BITRATE_BPS, calculatedVideoBitrate)
    )
  } else if (input.mode === 'manual' && input.manualVideoBitrateKbps) {
    videoBitrateBps = Math.min(
      MAX_VIDEO_BITRATE_BPS,
      Math.max(MIN_VIDEO_BITRATE_BPS, input.manualVideoBitrateKbps * 1000)
    )
  } else if (input.mode === 'quality') {
    // Quality CRF Mode (CRF 18-36: lower is higher quality)
    const crf = input.qualityCrf ?? 23
    const baseBitrate = 7_000_000 * Math.pow(0.5, (crf - 22) / 6)
    videoBitrateBps = Math.min(
      MAX_VIDEO_BITRATE_BPS,
      Math.max(MIN_VIDEO_BITRATE_BPS, Math.round(baseBitrate))
    )
  } else {
    // 'resolution' mode: High-fidelity calibrated bitrates
    const width = input.targetWidth ?? 1280
    const height = input.targetHeight ?? 720
    const fps = Math.max(24, input.targetFps || 30)
    const pixelCount = width * height

    let bpp = 0.11
    if (pixelCount >= 1920 * 1080) {
      bpp = 0.10
    } else if (pixelCount <= 854 * 480) {
      bpp = 0.14
    }

    const calculated = Math.round(pixelCount * fps * bpp)
    videoBitrateBps = Math.min(
      MAX_VIDEO_BITRATE_BPS,
      Math.max(MIN_VIDEO_BITRATE_BPS, calculated)
    )
  }

  const totalBitrateBps = videoBitrateBps + audioBitrateBps
  const estimatedSizeBytes = (totalBitrateBps * duration) / 8
  const estimatedSizeMb = Number((estimatedSizeBytes / (1024 * 1024)).toFixed(2))

  return {
    videoBitrateBps: Math.round(videoBitrateBps),
    audioBitrateBps: Math.round(audioBitrateBps),
    totalBitrateBps: Math.round(totalBitrateBps),
    estimatedSizeMb,
  }
}

export function getResolutionEstimates(
  originalWidth: number,
  originalHeight: number,
  durationSeconds: number,
  originalSizeBytes: number,
  audioOption: AudioOption = 'keep',
  audioBitrateKbps = 128
): ResolutionEstimateItem[] {
  const presets: { id: ResolutionPreset; label: string; sublabel: string; badge?: string }[] = [
    { id: 'original', label: 'Original', sublabel: 'Smart Compression', badge: 'Source' },
    { id: '1080p', label: '1080p Full HD', sublabel: 'Crisp Fidelity', badge: 'Crisp' },
    { id: '720p', label: '720p HD', sublabel: 'Balanced Speed & Quality', badge: 'Popular' },
    { id: '480p', label: '480p SD', sublabel: 'Lightweight & Fast Share' },
    { id: '360p', label: '360p Compact', sublabel: 'Minimal Data Usage' },
  ]

  const originalMb = originalSizeBytes / (1024 * 1024)

  return presets.map((item) => {
    const scaled = calculateScaledResolution(originalWidth, originalHeight, item.id, 1.0)
    const bitrateResult = calculateBitrates({
      mode: 'resolution',
      durationSeconds,
      targetWidth: scaled.width,
      targetHeight: scaled.height,
      audioOption,
      audioBitrateKbps,
    })

    const percentSavings =
      originalMb > 0
        ? Math.max(0, Math.round(((originalMb - bitrateResult.estimatedSizeMb) / originalMb) * 100))
        : 0

    return {
      preset: item.id,
      label: item.label,
      sublabel: item.sublabel,
      badge: item.badge,
      width: scaled.width,
      height: scaled.height,
      estimatedSizeMb: bitrateResult.estimatedSizeMb,
      percentSavings,
    }
  })
}
