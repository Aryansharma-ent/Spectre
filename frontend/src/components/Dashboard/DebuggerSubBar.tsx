import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { type TestRun } from "@/types"
import { RefreshCw } from "lucide-react"

interface DebuggerSubBarProps{
  runData : TestRun 
  onRerun: () => void;
  isRerunning: boolean;
}


export default function DebuggerSubBar({runData,onRerun,isRerunning} : DebuggerSubBarProps) {
  return (
    <section className="h-12 border-b border-[#1f1f23]/60 bg-[#0c0c0e]/30 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Link 
          to="/"
          className="flex items-center justify-center p-1 text-muted-foreground hover:text-white hover:bg-[#18181b] rounded transition-colors mr-1 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest font-mono">
          WORKSPACE: SPECTRE
        </span>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-bold text-muted-foreground hover:text-white font-mono">
          Default Demo Project
        </span>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-bold text-indigo-400 font-mono">{runData?.projectId}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded
        uppercase ${
          runData.status === 'PASSED' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-red-500 bg-red-500/10 border-red-500/20"
        }
        `} >
           {runData.status} ({runData.mismatchPercentage.toFixed(2)} % MISMATCH)
        </span>
        <span className="text-xs text-muted-foreground/45 font-mono">|</span>
        <span className="text-xs text-muted-foreground font-mono">{runData?.createdAt}</span>

         {/* New Rerun Button */}
     <span className="text-xs text-muted-foreground/45 font-mono">|</span>
      <button 
    onClick={onRerun}
    disabled={isRerunning}
    className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 rounded hover:bg-indigo-900/40 transition-colors text-[10px] font-semibold cursor-pointer font-mono disabled:opacity-55"
    >
    {isRerunning ? (
      <>
        <RefreshCw className="size-3 animate-spin" />
        Restarting...
      </>
    ) : (
      "Rerun Scan"
    )}
  </button>



      </div>
    </section>
  )
}
