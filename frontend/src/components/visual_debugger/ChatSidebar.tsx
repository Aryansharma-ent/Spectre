import { Send,Loader2 } from "lucide-react"
import { useState,useRef,useEffect } from "react"
import axios from "axios"
import type { TestRun } from "@/types"

interface Message{
  sender : 'user' | 'ai'
  text : string
}

interface ChatSidebarProps{
  runData : TestRun
  chatMessages : Message[]
  setChatMessages : React.Dispatch<React.SetStateAction<Message[]>>
}


export default function ChatSidebar({ runData , chatMessages , setChatMessages } : ChatSidebarProps) {
                    
               const [input,setInput] = useState<string>("")
               const [loading,setLoading] = useState(false)
               const messageEndRef = useRef<HTMLDivElement>(null)
             
     useEffect(()=>{
        if(messageEndRef.current){
          messageEndRef.current?.scrollIntoView({
            behavior : "smooth"
          })
        }
     },[chatMessages])


   const handleSend = async(e : React.FormEvent) =>{
      e.preventDefault()
      // check for input.trim() existence if not return
      if(!input.trim() || loading) return
          const userMessage = input.trim()
         setInput("")

        // set message sent by user and append it
         setChatMessages(prev => [...prev,{sender : 'user',text : userMessage}])
         setLoading(true)
      try {
        // history of chat
          const history = chatMessages.slice(1).map(msg => ({
            role : msg.sender === 'user' ? 'user' : 'model',
            parts :  [{text : msg.text}]
          }))


          const res = await axios.post(`http://localhost:8000/api/tests/run/${runData._id}/chat`, {
        message: userMessage,
        history
      });
         
      // append the data sent by Ai to the setchatmessages
         if(res.data.success){
          setChatMessages(prev => [...prev, {sender : 'ai',text : res.data.message}])
         }
      } catch (error) {
         console.log("error communicating with ai")

         setChatMessages(prev => [...prev,
         { sender: 'ai', text: "Sorry, I encountered an error trying to process that request. Please check that the backend is running and the Gemini API key is configured." }
         ])
      }finally{
        setLoading(false)
      }
  
   }



   const formatTextMessage = (text : string) => {
      const parts = text.split(/(```css|```html|```javascript|```json|```)/g)
      let isCodeBlock = false

      return parts.map((part,idx)=>{
         if(part.startsWith('```')){
          isCodeBlock = !isCodeBlock
          return null
         }

          // if we are inside a code block wrap it inside in a terminal layout
       if(isCodeBlock){
        return (
            <div key={idx} className="mt-2.5 bg-black p-2.5 border border-[#1f1f23] rounded text-[10px] font-mono text-emerald-400 overflow-x-auto">
            <pre className="font-mono text-emerald-400 whitespace-pre-wrap">{part.trim()}</pre>
          </div>
        )
       }

       // 2. parse inline tags : for eg - inline code wrraped in (` `)
       const inlineParts = part.split(/`([^`]+)`/g)
         return (
          <span key={idx}>
            {inlineParts.map((subPart , subIdx)=>{
               if(subIdx % 2 === 1){
                return (
                    <code key={subIdx} className="bg-black/30 text-indigo-400 px-1 py-0.5 rounded font-mono text-[11px] border border-[#1f1f23]">
                  {subPart}
                </code>
              )
            } 
            const boldParts = subPart.split(/\*\*([^*]+)\*\*/g)
             return boldParts.map((boldPart,boldIdx)=>{
               if(boldIdx % 2 === 1){
                 return (
                    <strong key={boldIdx} className="font-semibold text-white">{boldPart}</strong>
                 )
               }

           return boldPart.split('\n').map((line,lineIdx,array)=>(
               <span key={lineIdx}>
                  {line}
                  {lineIdx < array.length - 1 && <br />}
                </span>
           ))  

             })


              })
            }
                
                </span>
         )

      })
   } 

  return (
    <aside className="w-[380px] border-l border-[#1f1f23]/60 bg-[#0a0a0c]/40 flex flex-col shrink-0">
      
      {/* AI Assistant Header Info */}
      <div className="p-4 border-b border-[#1f1f23]/60">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
          🔮 Spectre Copilot
        </span>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Generative AI layout diagnostic analysis and fixes.
        </p>
      </div>

      {/* Layout Drift Anomalies list */}
      <div className="p-4 border-b h-25 border-[#1f1f23]/60 overflow-y-auto flex flex-col gap-2.5 bg-[#0c0c0e]/30">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block font-mono">
         Detected Regressions : {runData.visualBugs?.length || 0}
        </span>

        
      
            {!runData.visualBugs || runData.visualBugs.length === 0 ? (
              
        <div className="bg-[#101013] border border-[#1f1f23] rounded p-3 flex flex-col gap-1.5 hover:border-red-500/20 transition-all cursor-pointer">
          <div className="flex items-center justify-between">
               <p className="text-[10px] text-muted-foreground font-mono">No visual regressions detected.</p>
               </div>
               </div>
            ) : (
              runData.visualBugs.map((bug,index)=>(
             <div key={index}
              onClick={()=> setInput(`Tell me about Bug #${index + 1} ("${bug.element}") and how to fix it.`)}>
             <div className="bg-[#101013] border border-[#1f1f23] rounded p-3 flex flex-col gap-1.5 hover:border-red-500/20 transition-all cursor-pointer overflow-y-auto">
          <div className="flex items-center justify-between">
                bug element : {bug.element}
                
                </div>
                </div>
                </div>
              ))
            )
          }
          </div>
           
          


       
      

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {chatMessages.map((msg,index) =>(
          <div key={index}>
            {msg.sender === 'user' ? (
              <div className="flex flex-col gap-1.5 items-end">
          <span className="text-[9px] font-bold text-white font-mono uppercase tracking-wider block">
            Developer
          </span>
          <div className="bg-indigo-950/25 border border-indigo-500/25 rounded-lg p-3 text-xs leading-relaxed text-white max-w-[90%] font-mono">
             {msg.text}
          </div>
        </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">
                  Spectre AI
                </span>
                <div className="bg-[#0e0e11] border border-[#1f1f23] rounded-lg p-3 text-xs leading-relaxed text-muted-foreground font-mono">
                  {formatTextMessage(msg.text)}
                </div>
              </div>
            )}
                                     
          </div>
        ))}
        {/* Message: Assistant */}

        {loading && (
  <div className="flex flex-col gap-1.5">
    <span className="text-[9px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">
      Spectre AI
    </span>
    <div className="bg-[#0e0e11] border border-[#1f1f23] rounded-lg p-3 text-xs text-muted-foreground font-mono flex items-center gap-2">
      <Loader2 className="size-3.5 animate-spin text-indigo-500" />
      <span>Analyzing layout data...</span>
    </div>
  </div>
)}
       <div ref = {messageEndRef}></div>

      </div>

      {/* Chat Input Container */}
      <div className="p-4 border-t border-[#1f1f23]/60 bg-[#09090b]">
        <div className="relative">
          <form onSubmit={handleSend} className="relative" >
          <input 
            type="text" 
            value = {input}
            disabled = {loading}
            onChange={(e)=>setInput(e.target.value)}
   placeholder={loading ? "Waiting for Spectre..." : "Ask Spectre about this layout..."}
            className="bg-[#121214] border border-[#1f1f23] rounded pl-3 pr-10 py-2.5 text-xs text-white placeholder-muted-foreground/30 outline-none w-full font-mono focus:border-indigo-500/60"
          />
          <button type= "submit" disabled = {loading || !input.trim()} className="absolute right-2.5 top-2.5 p-1 text-muted-foreground hover:text-indigo-400 transition-colors cursor-pointer border-none bg-transparent">
            <Send className="size-3.5" />
          </button>
          </form>
        </div>
      </div>

    </aside>
  )
}
