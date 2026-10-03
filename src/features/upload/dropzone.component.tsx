import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { UploadCloud, ShieldCheck, Film } from 'lucide-react'

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  isProcessing?: boolean
}

export function Dropzone({ onFilesSelected, isProcessing = false }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isProcessing) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (isProcessing) return

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name)
    )

    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || isProcessing) return
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
    e.target.value = ''
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isProcessing && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center group ${
        isDragging
          ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_24px_rgba(59,130,246,0.15)]'
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70'
      } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-zinc-600 transition-all duration-200">
        <UploadCloud className="w-7 h-7 text-zinc-300 group-hover:text-blue-400 transition-colors" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-1">
        Drag & drop your video files here
      </h3>
      <p className="text-xs sm:text-sm text-zinc-400 mb-4 max-w-md">
        Supports MP4, WebM, MOV, MKV, and AVI. Choose single or batch videos to compress.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-850/80 border border-zinc-800 px-2.5 py-1 rounded-md">
          <Film className="w-3.5 h-3.5 text-zinc-500" />
          Hardware Accelerated
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-1 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          100% In-Browser & Private
        </span>
      </div>

      <button
        type="button"
        className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/70 transition-colors pointer-events-none"
      >
        Browse Files
      </button>
    </div>
  )
}
