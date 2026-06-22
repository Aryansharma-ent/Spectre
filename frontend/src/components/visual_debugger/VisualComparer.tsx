import { type TestRun } from "@/types"
import { useState, useRef } from "react"

interface VisualComparerProps {
  runData: TestRun
}

export default function VisualComparer({ runData }: VisualComparerProps) {

  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider' | 'diff'>('side-by-side')
  
  // 2. Manage position of slider comparison (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50)

  //  Track image display sizes to calculate scale factor
  const [imgSize, setImgSize] = useState({ width: 0, height: 0, naturalWidth: 1440 })
  const imgRef = useRef<HTMLImageElement>(null)

       const getFullUrl = (imagePath : string) => {
        if(!imagePath) return "" 
        if(imagePath.startsWith('http')){
          return imagePath
         }
         const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
         return `http://localhost:8000/${cleanPath}`
       }

    /* we need to get the native and displayed width of the image display 
      for Eg. puppeteer takes a screenshot of a website and its in 1440 wide display the bug is detected to be at 800 px from left suppose
        but when the image will load in frontend since the image will fit inside a css pane it might reduce in size and the bug could actually shift to like 700px
        which could lead to error thats why we will calculate both naturalWidth and clientWidth
    */ 
       const handleLoad = () =>{
        if(imgRef.current){
          setImgSize({
            width : imgRef.current.clientWidth,
            height : imgRef.current.clientHeight,
            naturalWidth : imgRef.current.naturalWidth,
          })
        }
       }
         
       // scale ratio so we could multiply this to our end width to get the correct bug position in our displayed image the frontend
         const scale = imgSize.width / (imgSize.naturalWidth || 1440)

  return (
    <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 bg-black/10">
      
      {/* Viewport Control Sub-Header */}
      <div className="flex justify-between items-center bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Visual Comparer
          </span>
          <span className="text-xs text-muted-foreground/30 font-mono">|</span>
          <span className="text-xs text-muted-foreground font-mono">Viewport: 1440 x 900</span>
        </div>
        <div className="flex bg-[#09090b] border border-[#1f1f23] p-0.5 rounded gap-1">
          <button 
            onClick={() => setViewMode('side-by-side')} 
            className={`px-2.5 py-1 text-[10px] font-semibold font-mono rounded border transition-colors cursor-pointer ${
              viewMode === 'side-by-side'
                ? "bg-indigo-950/40 text-indigo-400 border-indigo-500/20"
                : "text-muted-foreground hover:text-white border-transparent"
            }`}
          >
            Side by Side
          </button>
          <button 
            onClick={() => setViewMode('slider')}  
            className={`px-2.5 py-1 text-[10px] font-semibold font-mono rounded border transition-colors cursor-pointer ${
              viewMode === 'slider'
                ? "bg-indigo-950/40 text-indigo-400 border-indigo-500/20"
                : "text-muted-foreground hover:text-white border-transparent"
            }`}
          >
            Slider Overlay
          </button>
          <button 
            onClick={() => setViewMode('diff')}  
            className={`px-2.5 py-1 text-[10px] font-semibold font-mono rounded border transition-colors cursor-pointer ${
              viewMode === 'diff'
                ? "bg-indigo-950/40 text-indigo-400 border-indigo-500/20"
                : "text-muted-foreground hover:text-white border-transparent"
            }`}
          >
            Diff Map
          </button>
        </div>
      </div>

      {/* Screen Layouts Grid */}
      <div className="flex-1 flex justify-center items-start min-h-0">
        
        {/* VIEW 1: Side by Side Grid Layout */}
        {viewMode === 'side-by-side' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Staging Pane (Under Test) */}
            <div className="flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
              <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Staging Branch (Under Test)
                </span>
              </div>
              <div className="p-4 bg-[#09090b]/80 overflow-auto flex justify-center items-start relative min-h-[400px]">
                <div className="relative inline-block max-w-[800px] w-full">
                  <img 
                    ref={imgRef}
                    src={getFullUrl(runData.stagingScreenshotUrl)} 
                    alt="Staging"
                    onLoad={handleLoad}
                    className="w-full h-auto block border border-[#1f1f23] rounded"
                  />
                  {/* Dynamic absolute bounding boxes overlaying the image */}
                  {runData.visualBugs && runData.visualBugs.map((bug, index) => (
                    <div 
                      key={index}
                      className="absolute border border-dashed border-red-500 bg-red-500/10 group cursor-pointer hover:bg-red-500/25 transition-all"
                      style={{
                        left: `${bug.location.x * scale}px`,
                        top: `${bug.location.y * scale}px`,
                        width: `${bug.location.width * scale}px`,
                        height: `${bug.location.height * scale}px`,
                      }}
                    >
                      {/* Bounding box hover description bubble */}
                      <div className="absolute -top-6 left-0 bg-red-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                        {bug.element}: {bug.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Production Pane (Benchmark master) */}
            <div className="flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
              <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Production Branch (Benchmark)
                </span>
              </div>
              <div className="p-4 bg-[#09090b]/80 overflow-auto flex justify-center items-start min-h-[400px]">
                <div className="relative inline-block max-w-[800px] w-full">
                  <img 
                    src={getFullUrl(runData.productionScreenshotUrl)} 
                    alt="Production"
                    className="w-full h-auto block border border-[#1f1f23] rounded"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Slider Overlay comparison wipe */}
        {viewMode === 'slider' && (
          <div className="w-full max-w-[800px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
            <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Slider Comparison (Drag to Wipe)
              </span>
            </div>
            <div className="p-6 bg-[#09090b]/80 flex justify-center items-center">
              <div className="relative w-full aspect-[1440/900] select-none overflow-hidden border border-[#1f1f23] rounded">
                
                {/* Background master: Production */}
                <img 
                  src={getFullUrl(runData.productionScreenshotUrl)} 
                  alt="Production master"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                
                {/* Foreground layer: Staging (aligned and clipped using CSS clip-path) */}
                <img 
                  src={getFullUrl(runData.stagingScreenshotUrl)} 
                  alt="Staging source"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ 
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                  }}
                />
                
                {/* Visual slider divider bar */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-indigo-500 pointer-events-none flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="size-6 bg-indigo-600 border border-indigo-400 rounded-full flex items-center justify-center shadow-lg -translate-x-1/2 cursor-ew-resize">
                    <span className="text-[10px] text-white select-none">↔</span>
                  </div>
                </div>
                
                {/* Standard HTML range input placed over the screen for dragging actions */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: Diff Map highlighting pixel deviations */}
        {viewMode === 'diff' && (
          <div className="w-full max-w-[800px] flex flex-col bg-[#0c0c0e] border border-[#1f1f23] rounded-lg overflow-hidden">
            <div className="bg-[#0e0e11] border-b border-[#1f1f23] px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 font-mono">
                Visual Difference Pixel-Map
              </span>
            </div>
            <div className="p-6 bg-[#09090b]/80 flex justify-center items-center">
              <div className="relative w-full">
                <img 
                  src={getFullUrl(runData.diffScreenshotUrl)} 
                  alt="Diff Map"
                  className="w-full h-auto block border border-[#1f1f23] rounded"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
