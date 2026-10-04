import { Shield, Sparkles } from 'lucide-react'
import { InstallAppButton } from '@/components/layout/install_app_button.component'

export function Header() {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/70 flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5 text-zinc-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-zinc-100">Compressa</span>
              <span className="text-[10px] font-mono font-medium text-blue-400 bg-blue-950/50 border border-blue-800/50 px-1.5 py-0.2 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              High-Performance Client-Side Video Compressor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              100% In-Browser Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Hardware Accelerated
            </span>
          </div>

          <InstallAppButton />
        </div>
      </div>
    </header>
  )
}
