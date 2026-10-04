import { describe, it, expect } from 'vitest'
import { formatFileSize, calculateSavings } from '@/core/utils/file_size_formatter'
import { formatDuration, formatTimeWithSubseconds } from '@/core/utils/time_formatter'
import { calculateScaledResolution } from '@/core/utils/resolution_calculator'
import { calculateBitrates, getResolutionEstimates } from '@/core/utils/bitrate_calculator'

describe('File Size Formatter', () => {
  it('formats byte units properly', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(10485760)).toBe('10.0 MB')
    expect(formatFileSize(1073741824)).toBe('1.0 GB')
  })

  it('calculates savings accurately', () => {
    const { savedBytes, percentReduction } = calculateSavings(100_000_000, 20_000_000)
    expect(savedBytes).toBe(80_000_000)
    expect(percentReduction).toBe(80.0)
  })
})

describe('Time Formatter', () => {
  it('formats standard durations', () => {
    expect(formatDuration(45)).toBe('00:45')
    expect(formatDuration(125)).toBe('02:05')
    expect(formatDuration(3665)).toBe('01:01:05')
  })

  it('formats subseconds correctly', () => {
    expect(formatTimeWithSubseconds(12.34)).toBe('00:12.3')
  })
})

describe('Resolution Calculator', () => {
  it('scales 1080p to 720p with even dimensions', () => {
    const res = calculateScaledResolution(1920, 1080, '720p', 1.0)
    expect(res.height).toBe(720)
    expect(res.width).toBe(1280)
    expect(res.width % 2).toBe(0)
    expect(res.height % 2).toBe(0)
  })

  it('handles custom scale ratio', () => {
    const res = calculateScaledResolution(1920, 1080, 'custom', 0.5)
    expect(res.width).toBe(960)
    expect(res.height).toBe(540)
  })
})

describe('Bitrate Calculator', () => {
  it('calculates video bitrate to fit target size', () => {
    const res = calculateBitrates({
      mode: 'preset',
      durationSeconds: 10,
      targetSizeMb: 10,
      audioOption: 'compress',
      audioBitrateKbps: 64,
    })
    expect(res.estimatedSizeMb).toBeLessThanOrEqual(10.2)
    expect(res.videoBitrateBps).toBeGreaterThan(150_000)
  })

  it('calculates video bitrate and size according to selected resolution', () => {
    const res1080p = calculateBitrates({
      mode: 'resolution',
      durationSeconds: 60,
      targetWidth: 1920,
      targetHeight: 1080,
      audioOption: 'keep',
      audioBitrateKbps: 128,
    })

    const res720p = calculateBitrates({
      mode: 'resolution',
      durationSeconds: 60,
      targetWidth: 1280,
      targetHeight: 720,
      audioOption: 'keep',
      audioBitrateKbps: 128,
    })

    const res480p = calculateBitrates({
      mode: 'resolution',
      durationSeconds: 60,
      targetWidth: 854,
      targetHeight: 480,
      audioOption: 'keep',
      audioBitrateKbps: 128,
    })

    // Higher resolution should yield higher bitrate and larger estimated file size
    expect(res1080p.videoBitrateBps).toBeGreaterThan(res720p.videoBitrateBps)
    expect(res720p.videoBitrateBps).toBeGreaterThan(res480p.videoBitrateBps)
    expect(res1080p.estimatedSizeMb).toBeGreaterThan(res720p.estimatedSizeMb)
    expect(res720p.estimatedSizeMb).toBeGreaterThan(res480p.estimatedSizeMb)
  })

  it('generates resolution estimates for all standard tiers', () => {
    const estimates = getResolutionEstimates(1920, 1080, 60, 50 * 1024 * 1024)
    expect(estimates.length).toBe(5)
    const p720 = estimates.find((e) => e.preset === '720p')
    expect(p720).toBeDefined()
    expect(p720?.width).toBe(1280)
    expect(p720?.height).toBe(720)
    expect(p720?.estimatedSizeMb).toBeGreaterThan(0)
    expect(p720?.percentSavings).toBeGreaterThan(0)
  })
})
