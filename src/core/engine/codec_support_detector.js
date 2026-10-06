const MP4_CANDIDATES = [
  'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
  'video/mp4;codecs=avc1',
  'video/mp4',
]

const WEBM_CANDIDATES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=h264,opus',
  'video/webm',
]

export function detectSupportedCodecs() {
  const hasWebCodecs =
    typeof window !== 'undefined' &&
    'VideoEncoder' in window &&
    'VideoDecoder' in window

  if (hasWebCodecs) {
    return {
      supportsMp4: true,
      supportsWebm: true,
      recommendedFormat: 'mp4',
      mp4MimeType: 'video/mp4',
      webmMimeType: 'video/webm',
    }
  }

  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return {
      supportsMp4: false,
      supportsWebm: true,
      recommendedFormat: 'webm',
      mp4MimeType: null,
      webmMimeType: 'video/webm',
    }
  }

  let mp4MimeType = null
  for (const candidate of MP4_CANDIDATES) {
    try {
      if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(candidate)) {
        mp4MimeType = candidate
        break
      }
    } catch {
      // Continue next candidate
    }
  }

  let webmMimeType = null
  for (const candidate of WEBM_CANDIDATES) {
    try {
      if (typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(candidate)) {
        webmMimeType = candidate
        break
      }
    } catch {
      // Continue next candidate
    }
  }

  const supportsMp4 = mp4MimeType !== null
  const supportsWebm = webmMimeType !== null
  const recommendedFormat = supportsMp4 ? 'mp4' : 'webm'

  return {
    supportsMp4,
    supportsWebm,
    recommendedFormat,
    mp4MimeType,
    webmMimeType: webmMimeType ?? 'video/webm',
  }
}
