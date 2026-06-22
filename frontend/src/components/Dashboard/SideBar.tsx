import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, Play, Clock, Key, BookOpen, Radio } from "lucide-react"

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 border-r border-[#1f1f23] bg-[#0c0c0e] flex flex-col justify-between shrink-0 select-none">
      <div className="flex flex-col p-5 gap-7">
        {/* Logo Branding */}
        <div>
          <h1 className="text-base font-extrabold tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span>
            Spectre AI
          </h1>
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">
            PixelMatch Engine <span className="ml-1.5 px-1 py-0.2 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">v1.0.0</span>
          </p>
        </div>

        {/* SaaS Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              isActive("/") 
                ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <LayoutGrid className="size-4 shrink-0 text-indigo-400" />
            Dashboard
          </Link>
          <Link 
            to="/runs/run_93j8dnskq" 
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              isActive("/runs") 
                ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Play className="size-4 shrink-0 text-indigo-400" />
            Visual Debugger
          </Link>
          <Link 
            to="/projects/my-project/analytics" 
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              isActive("/projects/my-project/analytics") 
                ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Clock className="size-4 shrink-0 text-indigo-400" />
            Stability Analytics
          </Link>
          <Link 
            to="/projects/my-project/settings" 
            className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              isActive("/projects/my-project/settings") 
                ? "text-white bg-indigo-950/30 border border-indigo-500/20 shadow-sm" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <Key className="size-4 shrink-0 text-indigo-400" />
            Developer Settings
          </Link>
        </nav>
      </div>

      {/* Footer Sidebar Info */}
      <div className="p-4 border-t border-[#1f1f23]/60 flex flex-col gap-2.5">
        <a href="#docs" className="flex items-center gap-3 px-1 py-0.5 text-xs font-semibold text-muted-foreground hover:text-white transition-colors">
          <BookOpen className="size-4 shrink-0" />
          Docs
        </a>
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Radio className="size-4 shrink-0 text-emerald-500 animate-pulse" />
            Status
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold">ONLINE</span>
        </div>
      </div>
    </aside>
  )
}
