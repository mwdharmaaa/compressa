import type { AudioOption, CompressionMode, ResolutionPreset } from '@/core/types/compression.types'
import { calculateScaledResolution } from '@/core/utils/resolution_calculator'

export interface BitrateCalculationInput {
  mode: CompressionMode
  durationSeconds: number
  targetSizeMb?: number
  qualityCrf?: number
  manualVideoBitrateKbps?: number
  audioOption: AudioOption
  audioBitrateKbps?: number
  targetWidth?: number
  targetHeight?: number
  targetFps?: number
  resolutionPreset?: ResolutionPreset
  originalSizeBytes?: number
  originalWidth?: number
  originalHeight?: number
  customScale?: number
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

const MIN_VIDEO_BITRATE_BPS = 100_000 // 100 kbps minimum
const MAX_VIDEO_BITRATE_BPS = 25_000_000 // 25 Mbps maximum

export function calculateBitrates(input: BitrateCalculationInput): BitrateCalculationResult {
  const duration = Math.max(0.5, input.durationSeconds)

  const audioBitrateBps =
    input.audioOption === 'mute'
      ? 0
      : Math.max(96_000, (input.audioBitrateKbps || 128) * 1000)

  // Determine original bitrate ceiling if original size is provided
  let originalVideoBitrateBps: number | null = null
  let maxAllowedVideoBitrate = MAX_VIDEO_BITRATE_BPS

  if (input.originalSizeBytes && input.originalSizeBytes > 0) {
    const originalTotalBitrateBps = (input.originalSizeBytes * 8) / duration
    originalVideoBitrateBps = Math.max(MIN_VIDEO_BITRATE_BPS, originalTotalBitrateBps - audioBitrateBps)
    // Never allow compressed video bitrate to exceed 95% of source
    maxAllowedVideoBitrate = Math.round(originalVideoBitrateBps * 0.95)
  }

  let videoBitrateBps = 2_500_000

  if (input.mode === 'preset' && input.targetSizeMb && input.targetSizeMb > 0) {
    // 5% margin for container metadata and index tables
    const usableBytes = input.targetSizeMb * 1024 * 1024 * 0.95
    const totalBitrateBps = (usableBytes * 8) / duration
    const calculatedVideoBitrate = totalBitrateBps - audioBitrateBps
    videoBitrateBps = Math.min(
      maxAllowedVideoBitrate,
      Math.max(MIN_VIDEO_BITRATE_BPS, calculatedVideoBitrate)
    )
  } else if (input.mode === 'manual' && input.manualVideoBitrateKbps) {
    videoBitrateBps = Math.min(
      maxAllowedVideoBitrate,
      Math.max(MIN_VIDEO_BITRATE_BPS, input.manualVideoBitrateKbps * 1000)
    )
  } else if (input.mode === 'quality') {
    // Quality CRF Mode (CRF 18-38: lower is higher quality)
    const crf = input.qualityCrf ?? 23
    const baseBitrate = (originalVideoBitrateBps ?? 4_500_000) * Math.pow(0.5, (crf - 22) / 6)
    videoBitrateBps = Math.min(
      maxAllowedVideoBitrate,
      Math.max(MIN_VIDEO_BITRATE_BPS, Math.round(baseBitrate))
    )
  } else {
    // 'resolution' mode: Proportional to resolution and source bitrate
    const width = input.targetWidth ?? 1280
    const height = input.targetHeight ?? 720
    const targetPixels = width * height
    const originalPixels = (input.originalWidth && input.originalHeight)
      ? input.originalWidth * input.originalHeight
      : targetPixels

    if (originalVideoBitrateBps) {
      // Relative scaling against known source bitrate
      const pixelRatio = targetPixels / originalPixels
      let scaleFactor = 0.70

      if (input.resolutionPreset === 'original') {
        scaleFactor = 0.70
      } else if (input.resolutionPreset === '1080p') {
        scaleFactor = Math.min(0.85, Math.max(0.45, pixelRatio * 0.75))
      } else if (input.resolutionPreset === '720p') {
        scaleFactor = Math.min(0.65, Math.max(0.30, pixelRatio * 0.70))
      } else if (input.resolutionPreset === '480p') {
        scaleFactor = Math.min(0.45, Math.max(0.18, pixelRatio * 0.65))
      } else if (input.resolutionPreset === '360p') {
        scaleFactor = Math.min(0.28, Math.max(0.10, pixelRatio * 0.60))
      } else if (input.customScale) {
        scaleFactor = Math.min(0.85, Math.pow(input.customScale, 1.4) * 0.75)
      }

      videoBitrateBps = Math.round(originalVideoBitrateBps * scaleFactor)
    } else {
      // Calibrated BPP baseline when original size is unknown
      const fps = Math.max(24, input.targetFps || 30)
      let bpp = 0.08
      if (targetPixels >= 1920 * 1080) {
        bpp = 0.06
      } else if (targetPixels <= 854 * 480) {
        bpp = 0.10
      }
      videoBitrateBps = Math.round(targetPixels * fps * bpp)
    }

    videoBitrateBps = Math.min(
      maxAllowedVideoBitrate,
      Math.max(MIN_VIDEO_BITRATE_BPS, videoBitrateBps)
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
      resolutionPreset: item.id,
      originalSizeBytes,
      originalWidth,
      originalHeight,
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
