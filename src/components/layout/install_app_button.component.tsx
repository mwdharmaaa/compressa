import { useState } from 'react'
import { usePwaInstall } from '@/core/hooks/use_pwa_install.hook'
import { Download, Check, Share, X, Monitor, Smartphone } from 'lucide-react'

export function InstallAppButton() {
  const { hasPrompt, isInstalled, platform, promptInstall } = usePwaInstall()
  const [showModal, setShowModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'desktop' | 'android' | 'ios'>(platform)

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg shadow-sm">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Installed</span>
      </div>
    )
  }

  const handleClick = async () => {
    if (hasPrompt) {
      const installed = await promptInstall()
      if (!installed) {
        setShowModal(true)
      }
    } else {
      setShowModal(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border border-blue-500/60 px-3.5 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.35)] cursor-pointer"
        title="Install Compressa on Desktop or Mobile"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Install Compressa</h3>
                <p className="text-[11px] text-zinc-400">Desktop & Mobile Standalone App</p>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800 mb-4">
              <button
                type="button"
                onClick={() => setSelectedTab('desktop')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'desktop'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('android')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'android'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('ios')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'ios'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>iOS</span>
              </button>
            </div>

            {selectedTab === 'desktop' && (
              <div className="flex flex-col gap-2.5 text-xs text-zinc-300 mb-5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Address Bar Shortcut:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Look at the right side of your Chrome/Edge URL address bar and click the{' '}
                      <strong className="text-zinc-200">Install icon</strong> (computer monitor with down arrow).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Or Browser Menu:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Click the three dots (⋮) &rarr; select <strong className="text-zinc-200">Install Compressa</strong> or <strong className="text-zinc-200">Save and share &gt; Create Shortcut</strong> (check &quot;Open as window&quot;).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'android' && (
              <div className="flex flex-col gap-2.5 text-xs text-zinc-300 mb-5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Open Browser Menu:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Tap the three vertical dots (⋮) at the top-right in Chrome.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Install to Home Screen:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Tap <strong className="text-zinc-200">Install app</strong> or <strong className="text-zinc-200">Add to Home screen</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'ios' && (
              <div className="flex flex-col gap-2.5 text-xs text-zinc-300 mb-5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Share in Safari:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Tap the <Share className="w-3 h-3 inline text-blue-400 mx-0.5" /> Share button at the bottom of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-200 flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-200">Add to Home Screen:</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Scroll down and tap <strong className="text-zinc-200">Add to Home Screen</strong>, then tap <strong className="text-zinc-200">Add</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            {hasPrompt && (
              <button
                type="button"
                onClick={async () => {
                  const success = await promptInstall()
                  if (success) setShowModal(false)
                }}
                className="w-full mb-2 py-2 px-3 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              >
                Trigger Direct Native Install
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
