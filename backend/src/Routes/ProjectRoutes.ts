import { getProjects, getProjectRuns, createProject ,generateApikey} from "../Controllers/ProjectControllers";
import express from 'express'


const route = express.Router()

route.get('/', getProjects)
route.post('/', createProject)
route.get('/:projectId/runs', getProjectRuns)
route.post('/:id/generate-key',generateApikey)  

export default route
