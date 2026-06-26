import TestRun from "../models/TestRun";
import Project from "../models/Project";
import { Request,Response } from "express";
import AsyncHandler from 'express-async-handler'
import { GoogleGenerativeAI} from "@google/generative-ai";
import crypto from "crypto";

export const getProjects = AsyncHandler(async(req : Request,res : Response) : Promise<void> => {
    const projects = await Project.find().sort({createdAt : -1})

     res.status(200).json({
        success : true,
        count : projects.length,
        data : projects
     })
})


export const createProject = AsyncHandler(async(req : Request,res : Response) : Promise<void> => {
    const { name, stagingUrl, productionUrl } = req.body

    if (!name || !stagingUrl || !productionUrl) {
        res.status(400)
        throw new Error("Project name, stagingUrl, and productionUrl are all required.")
    }
     
       const apikey = crypto.randomBytes(24).toString("hex");

    const project = await Project.create({
        name,
        stagingUrl,
        productionUrl,
        apikey 
    })

    res.status(201).json({
        success : true,
        data : project
    })
})



export const getProjectRuns = AsyncHandler(async(req : Request,res : Response) : Promise<void> => {
     const {projectId} = req.params

     const project = await TestRun.find({projectId}).sort({createdAt : -1})

     res.status(200).json({
        success : true,
        data : project
     })
})


export const getTestRunById = AsyncHandler(async(req : Request,res : Response) : Promise<void> =>{
      const {runId} = req.params

      const Testrun = await TestRun.findById(runId)

      if(!Testrun){
        res.status(404)
        throw new Error("Test run not Found")
      }

      res.status(200).json({
        success : true,
        data : Testrun
      })
})




export const askSpectreChat = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { runId } = req.params;
    const { message, history } = req.body; // Extract user message & history from body

    if (!message) {
        res.status(400);
        throw new Error("Message is required in the request body.");
    }

    const Testrun = await TestRun.findById(runId);
     
    if (!Testrun) {
        res.status(404);
        throw new Error("Test run not found");
    }

    const api = process.env.GEMINI_API_KEY;
    if (!api) {
        res.status(404);
        throw new Error("API key not configured");
    }

    const genAI = new GoogleGenerativeAI(api);  
        // 1.systemInstruction 
    const systemInstruction = `
You are Spectre AI, an expert frontend CSS and layout debugging assistant.
The user is viewing a visual regression test run report for their web application and wants to discuss the visual bugs found.

Here is the context of the test run:
- Test Run ID: ${Testrun._id}
- Status: ${Testrun.status}
- Mismatch Percentage: ${Testrun.mismatchPercentage}%
- Mismatch Pixels: ${Testrun.mismatchPixelsCount} of ${Testrun.totalPixelsCompared} total pixels

Here are the visual bugs identified during this run:
${Testrun.visualBugs.map((bug: any, index: number) => `
Bug #${index + 1}:
- Element Selector: ${bug.element}
- Issue Description: ${bug.description}
- Position/Size: x=${bug.location.x}, y=${bug.location.y}, width=${bug.location.width}, height=${bug.location.height}
- Original AI Styling Suggestion:
\`\`\`css
${bug.aiSuggestion?.cssFix || 'No fix suggested.'}
\`\`\`
- AI Explanation: ${bug.aiSuggestion?.explanation || 'N/A'}
`).join('\n')}

Your Role and Guidelines:
1. Answer the user's questions specifically about these layout regressions and bugs.
2. Explain the CSS properties involved (e.g., flexbox, margins, positioning) that caused the shift.
3. When providing CSS fixes, make sure to write precise, copy-pasteable CSS overrides.
4. Keep your responses concise, highly technical, and formatted in clean Markdown.
`; 
    
 const model = genAI.getGenerativeModel({
         model: 'gemini-2.5-flash',
         systemInstruction : systemInstruction
         }); 


    //  Multi-turn Chat
    const chat = model.startChat({
        history: history || [], // Array of previous messages
    });

    // Send the user's new message to the chat
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    //  raw json return
    res.status(200).json({
        success: true,
        message: responseText
    });
});


export const generateApikey = AsyncHandler(async(req : Request,res : Response)=>{
      const {id} = req.params

      const project = await Project.findById(id)
      if(!project){
         res.status(404)
         throw new Error("Cannot find the project in the database")
      }

      let token;
      if(project.apikey){
        res.status(400)
        throw new Error("api key is already associated with this project")
      }

      token = crypto.randomBytes(24).toString("hex");

      project.apikey = token
      await project.save()

      res.status(200).json({
        success : true,
        data : token
      })
})