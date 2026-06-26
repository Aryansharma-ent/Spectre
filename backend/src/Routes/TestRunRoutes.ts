import express from 'express'
import { runTestCapture,rerunTestCapture } from '../Controllers/TestRunControllers'
import { askSpectreChat,getTestRunById } from '../Controllers/ProjectControllers'
import { protectApiKey } from "../Middlewares/AuthMiddleware";
const route = express.Router()

route.get('/run/:runId',getTestRunById)
route.post('/test-capture',protectApiKey,runTestCapture)
route.post('/run/:runId/rerun', rerunTestCapture) 
route.post('/run/:runId/chat',askSpectreChat)


export default route