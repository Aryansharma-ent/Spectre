export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
      {/* Total runs */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-colors">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75">
            Total runs
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">148</div>
        </div>
        <span className="text-[11px] text-emerald-500 font-semibold mt-2">
          +12 this week
        </span>
      </div>

      {/* Bugs detected */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-colors">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75">
            Bugs detected
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">23</div>
        </div>
        <span className="text-[11px] text-red-500 font-semibold mt-2">
          3 unresolved
        </span>
      </div>

      {/* Avg diff score */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-colors">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75">
            Avg diff score
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">1.4%</div>
        </div>
        <span className="text-[11px] text-emerald-500 font-semibold mt-2">
          down from 2.1%
        </span>
      </div>

      {/* AI fixes applied */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-5 flex flex-col justify-between hover:border-[#1f1f23]/80 transition-colors">
        <div>
          <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/75">
            AI fixes applied
          </span>
          <div className="text-2xl font-semibold text-white mt-1.5 font-mono">17</div>
        </div>
        <span className="text-[11px] text-emerald-500 font-semibold mt-2">
          94% accepted
        </span>
      </div>
    </div>
  )
}


