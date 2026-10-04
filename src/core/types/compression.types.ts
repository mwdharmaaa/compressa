export type CompressionMode = 'resolution' | 'preset' | 'quality' | 'manual'

export type ResolutionPreset = 'original' | '1080p' | '720p' | '480p' | '360p' | 'custom'

export type OutputFormat = 'mp4' | 'webm'

export type AudioOption = 'keep' | 'compress' | 'mute'

export interface CompressionOptions {
  mode: CompressionMode
  targetSizeMb?: number
  resolutionPreset: ResolutionPreset
  customScale: number
  targetFps: number
  qualityCrf: number
  manualVideoBitrateKbps: number
  audioOption: AudioOption
  audioBitrateKbps: number
  format: OutputFormat
  speedMultiplier?: number
  timeRange?: {
    start: number
    end: number
  }
}

export interface CompressionProgress {
  percentage: number
  processedSeconds: number
  totalSeconds: number
  currentFps: number
  estimatedRemainingSeconds: number
}

export interface CompressionResult {
  blob: Blob
  url: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  savedBytes: number
  duration: number
  width: number
  height: number
  format: OutputFormat
}
