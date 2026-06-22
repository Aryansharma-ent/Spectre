export default function FooterBar() {
  return (
    <footer className="h-10 border-t border-[#1f1f23] bg-[#0c0c0e]/40 flex items-center justify-between px-6 shrink-0 text-xs font-mono text-muted-foreground/80 select-none">
      <div className="flex items-center gap-5">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Verified Screens:</span>
          <span className="text-white ml-2">1,598</span>
        </div>
        <div className="h-3 w-px bg-[#1f1f23]"></div>
        <div>
          <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Average Shift:</span>
          <span className="text-white ml-2">0.14% pixels</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
          Delta Variance Health
        </span>
        <div className="h-2.5 w-32 bg-border/20 rounded-sm overflow-hidden relative border border-[#1f1f23]">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-sm w-[94%]"></div>
        </div>
      </div>
    </footer>
  )
}
