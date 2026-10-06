export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 mt-16 text-center">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          Compressa &middot; Crafted by{' '}
          <a
            href="https://github.com/mwdharmaaa"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4"
          >
            Mahendra Wira Dharma
          </a>
        </p>

        <p className="text-[11px] text-zinc-600">
          Client-side video encoding powered by WebCodecs, Canvas & MediaStream. No server uploads.
        </p>
      </div>
    </footer>
  )
}
