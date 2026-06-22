import { Search, Settings, HelpCircle } from "lucide-react"

export default function TopBar() {
  return (
    <header className="h-14 border-b border-[#1f1f23] flex items-center justify-between px-6 bg-[#09090b] shrink-0 select-none">
      {/* Left Tabs */}
      <div className="flex h-full items-end gap-1.5">
        <button className="px-4 py-3 text-xs font-semibold text-white border-b-2 border-indigo-500 transition-all font-mono">
          Overview
        </button>
        <button className="px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-white border-b-2 border-transparent transition-all">
          Test Runs
        </button>
        <button className="px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-white border-b-2 border-transparent transition-all">
          Integrations
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search runs..."
            className="bg-[#121214] text-xs pl-8 pr-4 py-2 border border-[#1f1f23] outline-none w-52 placeholder-muted-foreground/30 focus:border-indigo-500/60 rounded text-white"
          />
        </div>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Settings className="size-4" />
        </button>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <HelpCircle className="size-4" />
        </button>
        {/* User Avatar */}
        <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#1f1f23] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          A
        </div>
      </div>
    </header>
  )
}
