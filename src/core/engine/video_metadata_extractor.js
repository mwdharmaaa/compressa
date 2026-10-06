export async function extractVideoMetadata(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)

    video.preload = 'metadata'
    video.src = objectUrl
    video.muted = true
    video.playsInline = true

    const cleanUp = () => {
      URL.revokeObjectURL(objectUrl)
      video.removeAttribute('src')
      video.load()
    }

    video.onloadedmetadata = () => {
      // Seek slightly into the video to capture a meaningful thumbnail
      const seekTime = Math.min(1.0, video.duration > 0.5 ? video.duration / 4 : 0.1)
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 1280
        const height = video.videoHeight || 720
        const duration = video.duration || 1
        const aspectRatio = width / height
        const bitrate = Math.round((file.size * 8) / duration)

        // Generate thumbnail
        const canvas = document.createElement('canvas')
        const thumbWidth = 320
        const thumbHeight = Math.round(thumbWidth / aspectRatio)
        canvas.width = thumbWidth
        canvas.height = thumbHeight

        const ctx = canvas.getContext('2d')
        let thumbnailUrl = ''
        if (ctx) {
          ctx.drawImage(video, 0, 0, thumbWidth, thumbHeight)
          thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
        }

        cleanUp()

        resolve({
          name: file.name,
          size: file.size,
          type: file.type || 'video/mp4',
          duration,
          width,
          height,
          aspectRatio,
          bitrate,
          thumbnailUrl,
        })
      } catch (err) {
        cleanUp()
        reject(err instanceof Error ? err : new Error('Failed to extract video thumbnail'))
      }
    }

    video.onerror = () => {
      cleanUp()
      reject(new Error(`Unable to load video file: ${file.name}. Format may be unsupported.`))
    }
  })
}
