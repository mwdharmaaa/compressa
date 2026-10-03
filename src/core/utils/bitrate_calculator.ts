import type { AudioOption, CompressionMode } from '@/core/types/compression.types'

export interface BitrateCalculationInput {
  mode: CompressionMode
  durationSeconds: number
  targetSizeMb?: number
  qualityCrf?: number
  manualVideoBitrateKbps?: number
  audioOption: AudioOption
  audioBitrateKbps: number
}

export interface BitrateCalculationResult {
  videoBitrateBps: number
  audioBitrateBps: number
  totalBitrateBps: number
  estimatedSizeMb: number
}

const MIN_VIDEO_BITRATE_BPS = 150_000 // 150 kbps
const MAX_VIDEO_BITRATE_BPS = 25_000_000 // 25 Mbps

export function calculateBitrates(input: BitrateCalculationInput): BitrateCalculationResult {
  const duration = Math.max(0.5, input.durationSeconds)

  const audioBitrateBps =
    input.audioOption === 'mute'
      ? 0
      : input.audioOption === 'compress'
      ? 64_000
      : Math.max(32_000, (input.audioBitrateKbps || 128) * 1000)

  let videoBitrateBps = 1_500_000

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
  } else {
    // Quality CRF Mode (CRF 18-36: lower is higher quality)
    const crf = input.qualityCrf ?? 28
    // Map CRF 18 -> 4.5 Mbps, 28 -> 1.5 Mbps, 36 -> 400 kbps
    const baseBitrate = 4_500_000 * Math.pow(0.5, (crf - 18) / 6)
    videoBitrateBps = Math.min(
      MAX_VIDEO_BITRATE_BPS,
      Math.max(MIN_VIDEO_BITRATE_BPS, Math.round(baseBitrate))
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
