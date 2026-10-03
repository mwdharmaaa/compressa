export interface VideoMetadata {
  name: string
  size: number
  type: string
  duration: number
  width: number
  height: number
  aspectRatio: number
  bitrate: number
  thumbnailUrl: string
}

export interface VideoFileItem {
  id: string
  file: File
  metadata: VideoMetadata | null
  status: 'idle' | 'analyzing' | 'ready' | 'compressing' | 'completed' | 'error'
  errorMessage?: string
  progress?: number
  resultBlob?: Blob
  resultSize?: number
  resultUrl?: string
}
