import { Send } from "lucide-react"

export default function ChatSidebar() {
  return (
    <aside className="w-[380px] border-l border-[#1f1f23]/60 bg-[#0a0a0c]/40 flex flex-col shrink-0">
      
      {/* AI Assistant Header Info */}
      <div className="p-4 border-b border-[#1f1f23]/60">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
          🔮 Spectre Copilot
        </span>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Generative AI layout diagnostic analysis and fixes.
        </p>
      </div>

      {/* Layout Drift Anomalies list */}
      <div className="p-4 border-b border-[#1f1f23]/60 flex flex-col gap-2.5 bg-[#0c0c0e]/30">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
          Detected Regressions (1)
        </span>
        <div className="bg-[#101013] border border-[#1f1f23] rounded p-3 flex flex-col gap-1.5 hover:border-red-500/20 transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-400 font-mono">🐞 button.hero-cta shifted</span>
            <span className="text-[8px] font-mono text-muted-foreground font-semibold uppercase">Drift</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-mono">
            Drift coordinates: x=45px, width mismatch detected.
          </p>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        
        {/* Message: Assistant */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">
            Spectre AI
          </span>
          <div className="bg-[#0e0e11] border border-[#1f1f23] rounded-lg p-3 text-xs leading-relaxed text-muted-foreground">
            I analyzed the visual mismatch in <code className="text-indigo-400">.hero-cta</code>. Staging has a left padding offset shift compared to production. 
            <br /><br />
            Here is the copy-pasteable CSS override to fix the visual alignment:
            <div className="mt-2.5 bg-black p-2.5 border border-[#1f1f23] rounded text-[10px] font-mono text-emerald-400 overflow-x-auto font-sans">
              <pre className="font-mono text-emerald-400">
{`.hero-cta {
  margin-left: 0px !important;
  padding-left: 16px;
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Message: User */}
        <div className="flex flex-col gap-1.5 items-end">
          <span className="text-[9px] font-bold text-white font-mono uppercase tracking-wider block">
            Developer
          </span>
          <div className="bg-indigo-950/25 border border-indigo-500/25 rounded-lg p-3 text-xs leading-relaxed text-white max-w-[90%] font-mono">
            Why did this drift happen?
          </div>
        </div>

        {/* Message: Assistant reply */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">
            Spectre AI
          </span>
          <div className="bg-[#0e0e11] border border-[#1f1f23] rounded-lg p-3 text-xs leading-relaxed text-muted-foreground font-mono">
            The staging environment has CSS class <code className="text-red-400">ml-4</code> applied to the button element which offsets it by 16px. Production renders it inside a centered grid without an margin-left property.
          </div>
        </div>

      </div>

      {/* Chat Input Container */}
      <div className="p-4 border-t border-[#1f1f23]/60 bg-[#09090b]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask Spectre about this layout..." 
            className="bg-[#121214] border border-[#1f1f23] rounded pl-3 pr-10 py-2.5 text-xs text-white placeholder-muted-foreground/30 outline-none w-full font-mono focus:border-indigo-500/60"
          />
          <button className="absolute right-2.5 top-2.5 p-1 text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer border-none bg-transparent">
            <Send className="size-3.5" />
          </button>
        </div>
      </div>

    </aside>
  )
}
