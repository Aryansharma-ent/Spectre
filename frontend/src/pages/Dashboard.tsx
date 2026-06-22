import axios from 'axios'
import { Play, Loader2 } from 'lucide-react'
import { useState, useEffect } from "react"
import { type TestRun, type Project } from "../types"
import { useNavigate } from 'react-router-dom'
import Sidebar from "@/components/Dashboard/SideBar"
import TopBar from "@/components/Dashboard/TopBar"
import SubBar from "@/components/Dashboard/SubBar"
import StatsRow from "@/components/Dashboard/StatsRow"
import RecentRuns from "@/components/Dashboard/RecentRuns"
// import InspectorPanel from "@/components/InspectorPanel"
import FooterBar from "@/components/Dashboard/FooterBar"

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showCreateProject, setShowCreateProject] = useState<boolean>(false)
  const [showRunTest, setShowRunTest] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [name,setName] = useState<string>("")
  const [stagingUrl,setStagingUrl] = useState<string>("")
  const [productionUrl,setProductionUrl] = useState<string>("")
  const [isTesting, setIsTesting] = useState<boolean>(false)
  const [run,setRun] = useState<TestRun[]>([])

  const navigate = useNavigate()


const fetchProjects = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/projects");
    const json = await res.json();
    if (json.success) {
      setProjects(json.data);
    }
  } catch (error) {
    console.error("Failed to load projects:", error);
  } finally {
    setLoading(false);
  }
};


const handleCreateProject = async(e : React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:8000/api/projects",{
        name,
        stagingUrl,
        productionUrl
      })

      if(res.data.success){
         setName("");
      setStagingUrl("");
      setProductionUrl("");
      setShowCreateProject(false);
      fetchProjects();
      }
    } catch (error) {
      console.log("error while creating new project")
    }
}


const handleOpenRunModal = () => {
  if (selectedProject) {
    setStagingUrl(selectedProject.stagingUrl)
    setProductionUrl(selectedProject.productionUrl)
  }
  setShowRunTest(true)
}


const handleRunProject = async(e : React.FormEvent) => {
    e.preventDefault()
    setIsTesting(true)
    try {
   
      setShowRunTest(false)
      const res = await axios.post("http://localhost:8000/api/tests/test-capture",{
        projectId : selectedProject?._id,
        stagingUrl,
        productionUrl
      })

      if(res.data.success){
        const newRun = res.data.data;
        setStagingUrl("")
        setProductionUrl("")
        setRun(prev => [newRun, ...prev])
      }

    } catch (error) {
      console.log("error running the test case")
    }finally{
      setIsTesting(false)
      setLoading(false)
    }
}


 const fetchTestRun = async(projectId : string) => {
     try {
      const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/runs`)

      if(res.data.success){
         setRun(res.data.data)
      }
     } catch (error) {
       console.log("couldn't fetch the test runs")
     }
 }





useEffect(() => {
  fetchProjects();
}, []);

useEffect(() => {
  if (selectedProject) {
    fetchTestRun(selectedProject._id);
  }
}, [selectedProject]);



useEffect(()=>{
   let intervalId : any = null

   const hasRunningScan = run.some(r => r.status === 'RUNNING')

   if(selectedProject && hasRunningScan){
      intervalId = setInterval(()=>{
        fetchTestRun(selectedProject._id)
      },3000)
   }


   return()=>{
    if(intervalId) clearInterval(intervalId)
   }
},[run,selectedProject])
   



  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#c9d1d9] overflow-hidden font-sans select-none antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. Top Tabs & Header Controls */}
        <TopBar />

        {/* 3. Sub-bar breadcrumbs & Actions */}
        <SubBar 
          selectedProject = {selectedProject}
          onBackToProjects={()=> setSelectedProject(null)}
           onNewProjectClick={() => setShowCreateProject(true)}
          onNewRunClick={() => setShowRunTest(true)}
        />  

        {/* 4. Main workspace layout */}
        <div className="flex-1 flex min-h-0">
          {/* Middle: Stats grid & runs list */}
          <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {loading ? (<p>loading.....</p>) : selectedProject ? (
              <>
            <StatsRow
            
            />
            <RecentRuns
             RunData={run}
             stagingUrl={selectedProject?.stagingUrl}
             productionUrl = {selectedProject?.productionUrl}
            />
            </>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                      <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                      Projects ({projects.length})
                      </h2>
                </div>
          
              {projects.length == 0 ? (
                <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-8 text-center text-xm text-muted-foreground">
                        No projects found. Create one to get started!
                </div>    
              ):(
                <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project)=>(
                <div
                key = {project._id}
                onClick={() => setSelectedProject(project)}
                className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-indigo-500/50 p-5 rounded-lg flex flex-col gap-3 cursor-pointer transition-all hover:translate-y-[-2px]"> 
                      <h3 className="font-bold text-xs text-white font-mono">{project.name}</h3>
                                    <div className="text-[11px] text-muted-foreground flex flex-col gap-1 font-mono">
                       <div>Staging: {project.stagingUrl}</div>
                       <div>Prod: {project.productionUrl}</div>
                      </div>

                 </div>                  
              ))}
              </div>
              )
            }
        
            </div>
            )
          }
          </main>

        </div>


        <FooterBar />


{showCreateProject && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0c0c0e] border border-[#1f1f23] w-full max-w-md p-6 rounded-lg flex flex-col gap-5 shadow-2xl">
      <div>
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          Create New Project
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1">
          Register a website target to start visual regression testing.
        </p>
      </div>

      <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
            Project Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Acme Web App" 
            className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/20 focus:border-indigo-500/60 outline-none w-full font-mono"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
            Staging URL
          </label>
          <input 
            type="url" 
            placeholder="https://staging.acme.com" 
            className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/20 focus:border-indigo-500/60 outline-none w-full font-mono"
            value={stagingUrl}
            onChange={(e) => setStagingUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
            Production URL
          </label>
          <input 
            type="url" 
            placeholder="https://acme.com" 
            className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/20 focus:border-indigo-500/60 outline-none w-full font-mono"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-2 border-t border-[#1f1f23]/40 pt-4">
          <button 
            type="button" 
            onClick={() => setShowCreateProject(false)}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-white bg-transparent border border-[#1f1f23] rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-700 border border-indigo-500 rounded transition-colors cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  </div>
)}








{showRunTest && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0c0c0e] border border-[#1f1f23] w-full max-w-md p-6 rounded-lg flex flex-col gap-5 shadow-2xl">
      <div>
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          Run new Test case
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1">

        </p>
      </div>

      <form onSubmit = {handleRunProject} className="flex flex-col gap-4">
     
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
            Staging URL
          </label>
          <input 
            type="url" 
            placeholder="https://staging.acme.com" 
            className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/20 focus:border-indigo-500/60 outline-none w-full font-mono"
            value={stagingUrl}
            onChange={(e) => setStagingUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 block">
            Production URL
          </label>
          <input 
            type="url" 
            placeholder="https://acme.com" 
            className="bg-[#121214] border border-[#1f1f23] rounded px-3 py-2 text-xs text-white placeholder-muted-foreground/20 focus:border-indigo-500/60 outline-none w-full font-mono"
            value={productionUrl}
            onChange={(e) => setProductionUrl(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-2 border-t border-[#1f1f23]/40 pt-2 ">
          <button 
            type="button" 
            disabled={isTesting}
            onClick={() => setShowRunTest(false)}
            className="px-9 py-1 text-xs font-semibold text-muted-foreground hover:text-white bg-transparent border border-[#1f1f23] rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isTesting}
            className="px-9 py-1 text-xs flex justify-center items-center gap-2 font-semibold text-white bg-indigo-650 hover:bg-indigo-700 border border-indigo-500 rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
           {isTesting ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin" />
               Scanning...
             </>
           ) : (
             <>
               <Play className='w-5'/> Run 
             </>
           )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </div>
    </div>
  )
}
