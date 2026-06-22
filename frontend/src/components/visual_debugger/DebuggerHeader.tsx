import { Settings, HelpCircle } from "lucide-react"

export default function DebuggerHeader() {
  return (
    <header className="h-14 border-b border-[#1f1f23] flex items-center justify-between px-6 bg-[#09090b] shrink-0">
      <div className="flex h-full items-end gap-1.5">
        <button className="px-4 py-3 text-xs font-semibold text-white border-b-2 border-indigo-500 transition-all font-mono">
          Visual Debugger
        </button>
        <button className="px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-white border-b-2 border-transparent transition-all">
          DOM Inspector
        </button>
        <button className="px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-white border-b-2 border-transparent transition-all">
          Network Trace
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Settings className="size-4" />
        </button>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <HelpCircle className="size-4" />
        </button>
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#1f1f23] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          A
        </div>
      </div>
    </header>
  )
}
