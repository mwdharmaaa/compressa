import type { ResolutionPreset } from '@/core/types/compression.types'

export interface ScaledDimensions {
  width: number
  height: number
  scaleFactor: number
}

function makeEven(val: number): number {
  const rounded = Math.round(val)
  return rounded % 2 === 0 ? rounded : rounded - 1
}

export function calculateScaledResolution(
  origWidth: number,
  origHeight: number,
  preset: ResolutionPreset,
  customScale: number
): ScaledDimensions {
  if (origWidth <= 0 || origHeight <= 0) {
    return { width: 1280, height: 720, scaleFactor: 1 }
  }

  const aspectRatio = origWidth / origHeight
  const isLandscape = origWidth >= origHeight

  let targetDimension: number | null = null

  switch (preset) {
    case '1080p':
      targetDimension = 1080
      break
    case '720p':
      targetDimension = 720
      break
    case '480p':
      targetDimension = 480
      break
    case '360p':
      targetDimension = 360
      break
    case 'custom': {
      const clampedScale = Math.max(0.1, Math.min(1.0, customScale))
      const width = makeEven(origWidth * clampedScale)
      const height = makeEven(origHeight * clampedScale)
      return {
        width: Math.max(16, width),
        height: Math.max(16, height),
        scaleFactor: clampedScale,
      }
    }
    case 'original':
    default:
      return {
        width: makeEven(origWidth),
        height: makeEven(origHeight),
        scaleFactor: 1.0,
      }
  }

  // If original dimension is already smaller than target, keep original
  const primaryDimension = isLandscape ? origHeight : origWidth
  if (primaryDimension <= targetDimension) {
    return {
      width: makeEven(origWidth),
      height: makeEven(origHeight),
      scaleFactor: 1.0,
    }
  }

  if (isLandscape) {
    const height = makeEven(targetDimension)
    const width = makeEven(height * aspectRatio)
    return {
      width: Math.max(16, width),
      height: Math.max(16, height),
      scaleFactor: height / origHeight,
    }
  }

  const width = makeEven(targetDimension)
  const height = makeEven(width / aspectRatio)
  return {
    width: Math.max(16, width),
    height: Math.max(16, height),
    scaleFactor: width / origWidth,
  }
}
