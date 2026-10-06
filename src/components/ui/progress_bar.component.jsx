export function ProgressBar({ percentage, showLabel = false, className = '' }) {
  const clamped = Math.max(0, Math.min(100, percentage))

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-medium">Progress</span>
          <span className="text-zinc-200 font-mono font-semibold">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50 p-0.5">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
