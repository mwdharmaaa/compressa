export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || Number.isNaN(bytes)) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const digitGroups = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, digitGroups)
  return `${value.toFixed(value >= 100 || digitGroups === 0 ? 0 : 1)} ${units[digitGroups]}`
}

export function calculateSavings(originalBytes: number, compressedBytes: number): {
  savedBytes: number
  percentReduction: number
} {
  if (originalBytes <= 0) {
    return { savedBytes: 0, percentReduction: 0 }
  }

  const savedBytes = Math.max(0, originalBytes - compressedBytes)
  const percentReduction = Math.min(100, Math.max(0, (savedBytes / originalBytes) * 100))

  return {
    savedBytes,
    percentReduction: Number(percentReduction.toFixed(1)),
  }
}
