import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button.component'
import { Download, RotateCcw } from 'lucide-react'

export function ExportAction({ originalFileName, result, onReset }) {
  const handleDownload = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      })
    } catch {
      // safe fallback
    }

    const baseName = originalFileName.replace(/\.[^/.]+$/, '')
    const extension = result.format === 'webm' ? 'webm' : 'mp4'
    const downloadName = `${baseName}_compressed_${result.height}p.${extension}`

    const a = document.createElement('a')
    a.href = result.url
    a.download = downloadName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
      <Button
        variant="primary"
        size="lg"
        onClick={handleDownload}
        className="w-full sm:w-auto flex-1 gap-2 text-zinc-950 font-semibold"
      >
        <Download className="w-4 h-4" />
        Download Compressed Video
      </Button>

      <Button
        variant="secondary"
        size="lg"
        onClick={onReset}
        className="w-full sm:w-auto gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Compress Another Video
      </Button>
    </div>
  )
}
