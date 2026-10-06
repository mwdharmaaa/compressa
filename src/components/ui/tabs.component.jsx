export function Tabs({ items, activeId, onChange, size = 'md' }) {
  const paddingStyle = size === 'sm' ? 'p-0.5' : 'p-1'
  const buttonStyle = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'

  return (
    <div className={`inline-flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg ${paddingStyle}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 font-medium rounded-md transition-all duration-150 cursor-pointer ${buttonStyle} ${
              isActive
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
