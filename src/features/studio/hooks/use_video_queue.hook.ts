import { useState } from 'react'
import type { VideoFileItem } from '@/core/types/video.types'
import { extractVideoMetadata } from '@/core/engine/video_metadata_extractor'

export function useVideoQueue() {
  const [items, setItems] = useState<VideoFileItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleFilesSelected = async (files: File[]) => {
    const newItems: VideoFileItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      metadata: null,
      status: 'analyzing',
    }))

    setItems((prev) => [...prev, ...newItems])
    if (!activeId && newItems.length > 0) setActiveId(newItems[0].id)

    for (const item of newItems) {
      try {
        const meta = await extractVideoMetadata(item.file)
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, metadata: meta, status: 'ready' } : i))
        )
      } catch (err) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'error', errorMessage: err instanceof Error ? err.message : 'Error' }
              : i
          )
        )
      }
    }
  }

  const removeItem = (id: string) => {
    const filtered = items.filter((i) => i.id !== id)
    setItems(filtered)
    if (activeId === id) setActiveId(filtered[0]?.id ?? null)
  }

  const activeItem = items.find((i) => i.id === activeId) ?? null

  return {
    items,
    activeId,
    activeItem,
    setItems,
    setActiveId,
    handleFilesSelected,
    removeItem,
  }
}
