/**
 * @typedef {Object} VideoMetadata
 * @property {string} name
 * @property {number} size
 * @property {string} type
 * @property {number} duration
 * @property {number} width
 * @property {number} height
 * @property {number} aspectRatio
 * @property {number} bitrate
 * @property {string} thumbnailUrl
 *
 * @typedef {Object} VideoFileItem
 * @property {string} id
 * @property {File} file
 * @property {VideoMetadata | null} metadata
 * @property {'idle' | 'analyzing' | 'ready' | 'compressing' | 'completed' | 'error'} status
 * @property {string} [errorMessage]
 * @property {number} [progress]
 * @property {Blob} [resultBlob]
 * @property {number} [resultSize]
 * @property {string} [resultUrl]
 */

export const VIDEO_STATUSES = ['idle', 'analyzing', 'ready', 'compressing', 'completed', 'error']
