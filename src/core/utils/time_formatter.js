export function formatDuration(seconds) {
  if (!seconds || seconds <= 0 || Number.isNaN(seconds)) return '00:00'

  const totalSeconds = Math.floor(seconds)
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60

  const pad = (n) => n.toString().padStart(2, '0')

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  return `${pad(mins)}:${pad(secs)}`
}

export function formatTimeWithSubseconds(seconds) {
  if (!seconds || seconds <= 0 || Number.isNaN(seconds)) return '00:00.0'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const tenths = Math.floor((seconds % 1) * 10)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(mins)}:${pad(secs)}.${tenths}`
}
