import type { OutputFormat } from '@/core/types/compression.types'

export interface SupportedCodecs {
  supportsMp4: boolean
  supportsWebm: boolean
  recommendedFormat: OutputFormat
  mp4MimeType: string | null
  webmMimeType: string | null
}

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

export function detectSupportedCodecs(): SupportedCodecs {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return {
      supportsMp4: false,
      supportsWebm: true,
      recommendedFormat: 'webm',
      mp4MimeType: null,
      webmMimeType: 'video/webm',
    }
  }

  let mp4MimeType: string | null = null
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

  let webmMimeType: string | null = null
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
  const recommendedFormat: OutputFormat = supportsMp4 ? 'mp4' : 'webm'

  return {
    supportsMp4,
    supportsWebm,
    recommendedFormat,
    mp4MimeType,
    webmMimeType: webmMimeType ?? 'video/webm',
  }
}
