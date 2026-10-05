export interface AudioRoutingResult {
  audioTrack: MediaStreamTrack | null
  cleanup: () => void
}

export function setupAudioRouting(
  videoElement: HTMLVideoElement,
  isMuted: boolean
): AudioRoutingResult {
  if (isMuted) {
    return {
      audioTrack: null,
      cleanup: () => {},
    }
  }

  // Try native captureStream on HTMLVideoElement first to avoid Web Audio buffer clicks
  try {
    const videoWithCapture = videoElement as HTMLVideoElement & {
      captureStream?: () => MediaStream
      mozCaptureStream?: () => MediaStream
    }
    const nativeStream = videoWithCapture.captureStream?.() ?? videoWithCapture.mozCaptureStream?.()
    const nativeAudioTrack = nativeStream?.getAudioTracks()[0]
    if (nativeAudioTrack) {
      return {
        audioTrack: nativeAudioTrack,
        cleanup: () => {
          try {
            nativeAudioTrack.stop()
          } catch {
            // Safe cleanup
          }
        },
      }
    }
  } catch {
    // Fall back to AudioContext if captureStream is restricted
  }

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) {
      return { audioTrack: null, cleanup: () => {} }
    }

    const audioCtx = new AudioContextClass({ latencyHint: 'playback' })
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    const sourceNode = audioCtx.createMediaElementSource(videoElement)
    const destinationNode = audioCtx.createMediaStreamDestination()

    // Route to destination stream, but NOT to audioCtx.destination (keeps it quiet during compression)
    sourceNode.connect(destinationNode)

    const audioTrack = destinationNode.stream.getAudioTracks()[0] ?? null

    const cleanup = () => {
      try {
        sourceNode.disconnect()
        destinationNode.disconnect()
        if (audioCtx.state !== 'closed') {
          audioCtx.close()
        }
      } catch {
        // Safe error suppression during audio context release
      }
    }

    return { audioTrack, cleanup }
  } catch {
    return { audioTrack: null, cleanup: () => {} }
  }
}
