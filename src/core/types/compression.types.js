/**
 * @typedef {'resolution' | 'preset' | 'quality' | 'manual'} CompressionMode
 * @typedef {'original' | '1080p' | '720p' | '480p' | '360p' | 'custom'} ResolutionPreset
 * @typedef {'mp4' | 'webm'} OutputFormat
 * @typedef {'keep' | 'mute'} AudioOption
 *
 * @typedef {Object} CompressionOptions
 * @property {CompressionMode} mode
 * @property {number} [targetSizeMb]
 * @property {ResolutionPreset} resolutionPreset
 * @property {number} customScale
 * @property {number} targetFps
 * @property {number} qualityCrf
 * @property {number} manualVideoBitrateKbps
 * @property {AudioOption} audioOption
 * @property {number} [audioBitrateKbps]
 * @property {OutputFormat} format
 * @property {number} [speedMultiplier]
 * @property {{ start: number, end: number }} [timeRange]
 *
 * @typedef {Object} CompressionProgress
 * @property {number} percentage
 * @property {number} processedSeconds
 * @property {number} totalSeconds
 * @property {number} currentFps
 * @property {number} estimatedRemainingSeconds
 *
 * @typedef {Object} CompressionResult
 * @property {Blob} blob
 * @property {string} url
 * @property {number} originalSize
 * @property {number} compressedSize
 * @property {number} compressionRatio
 * @property {number} savedBytes
 * @property {number} duration
 * @property {number} width
 * @property {number} height
 * @property {OutputFormat} format
 */

export const COMPRESSION_MODES = ['resolution', 'preset', 'quality', 'manual']
export const RESOLUTION_PRESETS = ['original', '1080p', '720p', '480p', '360p', 'custom']
export const OUTPUT_FORMATS = ['mp4', 'webm']
export const AUDIO_OPTIONS = ['keep', 'mute']
