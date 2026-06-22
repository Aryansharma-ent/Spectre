import { Link } from "react-router-dom"
import { ArrowDown, ArrowRight } from "lucide-react"

export default function InspectorPanel() {
  return (
    <aside className="w-80 border-l border-[#1f1f23]/60 bg-[#0a0a0c]/40 p-5 flex flex-col gap-5 overflow-y-auto shrink-0 select-none">
      <div>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1 font-mono">
          AI Inspector
        </span>
        <p className="text-[11px] text-muted-foreground">Detailed drift anomaly stats and suggestions.</p>
      </div>

      {/* Last Diff Card */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-4 flex flex-col justify-between gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Last diff
            </span>
            <span className="text-white font-mono text-[11px] font-semibold">run_93j8dnskq</span>
          </div>
          <span className="text-[9px] font-mono text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 border border-red-500/20 rounded">
            1.45% mismatch
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          {/* Production */}
          <div className="border border-[#1f1f23] bg-black/40 p-2 text-center rounded">
            <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold block mb-1">
              production
            </span>
            <div className="h-12 w-full flex items-center justify-center bg-black border border-border/20 rounded">
              <span className="text-[8px] text-muted-foreground font-semibold">Head</span>
            </div>
          </div>

          {/* Difference */}
          <div className="border border-red-500/20 bg-black/40 p-2 text-center rounded">
            <span className="text-[8px] uppercase tracking-wider text-red-400 font-bold block mb-1">
              difference
            </span>
            <div className="h-12 w-full flex items-center justify-center bg-black border border-red-500/10 rounded relative">
              <ArrowDown className="size-3.5 text-red-400 animate-bounce" />
            </div>
          </div>
        </div>

        <Link to="/runs/run_93j8dnskq" className="w-full text-center py-1.5 border border-border rounded text-[10px] font-bold tracking-wider uppercase text-white hover:bg-white/5 transition-colors">
          Analyze drift
        </Link>
      </div>

      {/* Ask Spectre Card */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-4 flex flex-col justify-between gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block font-mono">
            Ask Spectre
          </span>
          <span className="text-[8px] font-bold text-muted-foreground/60 tracking-wider uppercase">
            AI Ready
          </span>
        </div>

        <div className="bg-black/60 border border-border p-3 rounded font-mono text-[10px] leading-relaxed flex flex-col gap-2">
          <div className="flex items-center gap-1 text-white">
            <span className="text-red-400">🐞</span>
            <span className="font-semibold truncate">button.hero-cta shifted</span>
          </div>
          <div className="text-indigo-400 text-[9.5px]">.hero-cta</div>
          <div className="text-muted-foreground bg-black p-2 border border-[#1f1f23] rounded text-[9px] overflow-x-auto">
            <code>
              .hero-cta {"{"} <br />
              &nbsp;&nbsp;background: #4f46e5 !important;<br />
              &nbsp;&nbsp;margin-left: 0px;<br />
              {"}"}
            </code>
          </div>
        </div>

        <Link to="/runs/run_93j8dnskq?focusChat=true" className="text-right text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-end gap-1">
          Consult Copilot
          <ArrowRight className="size-3" />
        </Link>
      </div>
    </aside>
  )
}
