import { Link } from "react-router-dom"
import { ArrowRight,AlertTriangle,CheckCircle,RefreshCw} from "lucide-react"
import type { TestRun } from "@/types"

interface RecentRunSubProps{
  RunData : TestRun[]
  stagingUrl : string,
  productionUrl : string
}


export default function RecentRuns({RunData,stagingUrl,productionUrl} : RecentRunSubProps) {

   const timeAgo = (dateString : string) => {
       const date = new Date(dateString)
       const seconds = Math.floor((new Date().getTime() - date.getTime())/1000)
       if(seconds < 60) return 'Just now'
       const minutes = Math.floor(seconds / 60)
       if(minutes < 60) return `${minutes}m ago`
       const hours = Math.floor(minutes/60)
       if(hours < 24) return `${hours}h ago`

       return date.toLocaleDateString()
   }



  return (
    <div className="flex flex-col gap-3 select-none">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Recent runs
        </span>
        <Link to="/runs/run_93j8dnskq" className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors">
          View all
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {RunData.map((Run)=>{
             const isRunning = Run.status === 'RUNNING'

// Extract the core layout card structure so we can reuse it
const CardContent = (
  <div className={`bg-[#0c0c0e] border rounded-lg p-5 flex flex-col gap-3 relative overflow-hidden transition-all ${
    isRunning 
      ? "border-indigo-500/25 shadow-[0_0_12px_rgba(99,102,241,0.04)]" 
      : Run.status === 'FAILED'
        ? "border-red-500/15 hover:border-red-500/35 hover:bg-red-500/5 hover:translate-x-0.5" 
        : "border-[#1f1f23] hover:border-emerald-500/35 hover:bg-emerald-500/5 hover:translate-x-0.5"
  }`}>
    <div className="flex justify-between items-start z-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white font-mono truncate max-w-[200px] lg:max-w-[380px]">{stagingUrl}</span>
          <ArrowRight className="size-3 text-muted-foreground/60" />
          <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px] lg:max-w-[380px]">{productionUrl}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mt-1 font-mono">
          {isRunning ? (
            <>
              <span className="flex items-center gap-1 text-indigo-400">⏱ Running now</span>
              <span>•</span>
              <span className="text-muted-foreground/60">Capturing screenshots...</span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground/60">{timeAgo(Run.createdAt)}</span>
              <span>•</span>
              <span>{Run.mismatchPixelsCount} pixels differed</span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Status Badge */}
      {isRunning ? (
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 border border-indigo-500/20 rounded flex items-center gap-1.5">
          <RefreshCw className="size-2.5 animate-spin" />
          Running
        </span>
      ) : Run.status === 'FAILED' ? (
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-red-500 bg-red-500/10 px-2.5 py-0.5 border border-red-500/20 rounded flex items-center gap-1.5">
          <AlertTriangle className="size-2.5" />
          FAILED ({Run.mismatchPercentage.toFixed(2)}%)
        </span>
      ) : (
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded flex items-center gap-1.5">
          <CheckCircle className="size-2.5" />
          PASSED
        </span>
      )}
    </div>

    {/* Pulsing indicator line for running tests */}
    {isRunning && (
      <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 w-full animate-[pulse_1.5s_infinite]"></div>
    )}
  </div>
)

// Make card clickable ONLY if the run is completed
if (isRunning) {
  return <div key={Run._id}>{CardContent}</div>
}

return (
  <Link key={Run._id} to={`/runs/${Run._id}`} className="block cursor-pointer">
    {CardContent}
  </Link>
)

 
       })}
      </div>
    </div>
  )
}
