import { Request,Response,NextFunction } from "express";
import Project from "../models/Project";
import AsyncHandler from 'express-async-handler'


export const protectApiKey = AsyncHandler(async(req : Request,res : Response,next : NextFunction)=>{
       const api = req.headers['x-api-key']

       if(!api){
        res.status(401)
        throw new Error("api key doesn't exist")
       }

       const project = await Project.findOne({apikey : api})

       if(!project){
         res.status(401)
         throw new Error("Invalid Api key")
       }
      // Attaching the project to the request object so controllers can use it
       (req as any).project = project;
        next()
})