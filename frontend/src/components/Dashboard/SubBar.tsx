import { Filter, Play ,ArrowLeft, FolderPlus} from "lucide-react"
import type { Project } from "@/types"

interface SubBarProps {
  selectedProject : Project | null,
  onBackToProjects : () => void
  onNewProjectClick: () => void; 
  onNewRunClick: () => void;   
}

export default function SubBar({selectedProject,onBackToProjects,onNewProjectClick,onNewRunClick}: SubBarProps) {
  return (
    <section className="h-12 border-b border-[#1f1f23]/60 bg-[#0c0c0e]/30 flex items-center justify-between px-6 shrink-0 select-none">
      <div className="flex items-center gap-2">
     {selectedProject && (
  <button onClick={onBackToProjects} className="cursor-pointer mr-1.5 hover:text-white transition-colors">
    <ArrowLeft className="size-4" />
  </button>
     )}
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest font-mono">
          WORKSPACE: SPECTRE
        </span>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-bold text-white font-mono">Project Registry</span>
        {selectedProject && (
    <>
    <span className="text-xs text-muted-foreground mx-1.5">/</span>
    <span className="text-xs font-bold text-indigo-400 font-mono">{selectedProject.name}</span>
    </>
    )}
      </div>

      <div className="flex items-center gap-2.5">
        <button className="flex items-center gap-1.5 px-3 py-1 border border-[#1f1f23] text-white hover:bg-[#18181b] text-xs font-medium transition-colors rounded">
          <Filter className="size-3.5 text-muted-foreground" />
          Filter
        </button>
        {selectedProject ? ( 
             <button onClick={onNewRunClick} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-650 hover:bg-indigo-700 border border-indigo-500 text-white text-xs font-semibold transition-colors rounded shadow-sm">
          <Play className="size-3.5" />
          New run
        </button>
        ) : (
          <button onClick={onNewProjectClick} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-650 hover:bg-indigo-700 border border-indigo-500 text-white text-xs font-semibold transition-colors rounded shadow-sm">
          <FolderPlus className = "size-3.5" />
          New Project
        </button>
        )}
        
      </div>
    </section>
  )
}
