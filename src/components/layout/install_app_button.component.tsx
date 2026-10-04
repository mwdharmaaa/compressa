import { useState } from 'react'
import { usePwaInstall } from '@/core/hooks/use_pwa_install.hook'
import { Download, Check, Share, X, Smartphone } from 'lucide-react'

export function InstallAppButton() {
  const { isInstallable, hasPrompt, isInstalled, isIos, promptInstall } = usePwaInstall()
  const [showIosModal, setShowIosModal] = useState(false)

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1.5 rounded-lg">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed</span>
      </div>
    )
  }

  if (!isInstallable) {
    return null
  }

  const handleClick = async () => {
    if (hasPrompt) {
      await promptInstall()
    } else if (isIos) {
      setShowIosModal(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 text-xs font-medium text-zinc-100 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border border-blue-500/50 px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] cursor-pointer"
        title="Install Compressa on Desktop or Mobile"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {/* iOS or Manual Installation Guide Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Install Compressa</h3>
                <p className="text-[11px] text-zinc-400">Add to Home Screen</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Install Compressa on your device for standalone zero-browser launch, faster access, and offline optimization:
            </p>

            <ol className="space-y-2.5 text-xs text-zinc-300 mb-5">
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0">
                  1
                </span>
                <span>
                  Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> Share button in Safari
                </span>
              </li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0">
                  2
                </span>
                <span>Select &quot;Add to Home Screen&quot;</span>
              </li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0">
                  3
                </span>
                <span>Launch Compressa directly like a native app</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
