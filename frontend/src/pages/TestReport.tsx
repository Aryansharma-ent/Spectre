import axios from "axios"
import Sidebar from "../components/Dashboard/SideBar"
import DebuggerHeader from "@/components/visual_debugger/DebuggerHeader"
import DebuggerSubBar from "@/components/visual_debugger/DebuggerSubBar"
import VisualComparer from "@/components/visual_debugger/VisualComparer"
import ChatSidebar from "@/components/visual_debugger/ChatSidebar"
import { type TestRun } from "@/types"
import { useParams } from "react-router-dom"
import { useEffect,useState } from "react"
import { RefreshCw } from "lucide-react"

interface Message {
  sender: 'user' | 'ai';
  text: string;
}


export default function TestReport() {
      const [runData,setRundata] = useState<TestRun | null>(null)
      const [loading,setLoading] = useState<boolean>(true)
      const [chatMessages,setChatMessages] = useState<Message[]>([])
     const { runId } = useParams<{ runId: string }>()
     const [isRerunning, setIsRerunning] = useState<boolean>(false)

     const LoadTestData = async() =>{
       try {
         const res = await axios.get(`http://localhost:8000/api/tests/run/${runId}`)

         if(res.data.success){
          const data = res.data.data
          setRundata(data)
          
          // Seed initial Spectre Copilot message summarizing regressions
          if (data.visualBugs && data.visualBugs.length > 0) {
            const bugList = data.visualBugs.map((b: any, index: number) => 
              `${index + 1}. \`${b.element}\`: ${b.description}`
            ).join("\n")
            
            setChatMessages([
              {
                sender: 'ai',
                text: `Hello! I have analyzed the visual mismatch report for run **run_${data._id.substring(0, 8)}**.\n\nHere are the regressions I identified:\n\n${bugList}\n\nAsk me details about any regression, or ask for the CSS patch code!`
              }
            ])
          } else {
            setChatMessages([
              {
                sender: 'ai',
                text: `Hello! No visual regressions were detected in this run. Everything looks perfect!`
              }
            ])
          }
         }
       } catch (error) {
         console.log("error fetching the test run data")
       }finally{
        setLoading(false)
       }
     }


     const handleRerun = async() =>{
      if( !runId || isRerunning) return 
      setIsRerunning(true)
        try {
          const res = await axios.post(`http://localhost:8000/api/tests/run/${runId}/rerun`);

              if (res.data.success) {
      // Updating state to RUNNING so it immediately triggers the loading screen and polling
           setRundata(res.data.data);
          }
        } catch (error) {
          console.log("error rerunning")
        }finally{
          setIsRerunning(false)
        }
     }

     useEffect(()=>{
      if(runId){
        LoadTestData()
      }
     },[runId])

     useEffect(()=>{
        let intervalId : any = null

        if(runId && runData?.status === 'RUNNING'){
          intervalId = setInterval(async()=>{
            try {
              const res = await axios.get(`http://localhost:8000/api/tests/run/${runId}`);
            if (res.data.success) {
            setRundata(res.data.data);
            }
            } catch (error) {
                console.error("Error polling run details:", error);
            }
          },3000)
        }

          return () => {
          if (intervalId) clearInterval(intervalId);
           };
     },[runId,runData])

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. Top Header Controls */}
        <DebuggerHeader />

        {/* 3. Sub-bar breadcrumbs & Status */}
        {loading || runData?.status === 'RUNNING' ? (
          <div className="flex-1 flex items-center justify-center bg-black/10 font-mono text-xs text-indigo-400">
     <div className="flex flex-col items-center gap-3">
       <RefreshCw className="size-6 animate-spin text-indigo-500" />
       <span>Spectre is capturing screenshots & running pixel-level comparisons...</span>
     </div>
       </div>  
        ) : !runData ? (
            <div className="flex-1 flex items-center justify-center font-mono text-xs text-red-500 bg-red-950/10 border border-red-900/20">
            Test run not found in Database.
            </div>
        ):(
         <>
           <DebuggerSubBar
             runData = {runData}
             onRerun={handleRerun}
             isRerunning={isRerunning}
           />

        {/* 4. Main Visual Debugger Workspace */}
        <div className="flex-1 flex min-h-0">
          
          {/* Left Area: Screenshot comparison viewport */}
          <VisualComparer
           runData = {runData}
          />

          {/* Right Area: Ask Spectre Chat Assistant */}
          <ChatSidebar
          runData={runData} 
          chatMessages={chatMessages} 
         setChatMessages={setChatMessages} 
          />

        </div>
        </>
        )}

       
      </div>
    </div>
  )
}
