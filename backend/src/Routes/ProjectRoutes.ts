import { getProjects, getProjectRuns, createProject } from "../Controllers/ProjectControllers";
import express from 'express'

const route = express.Router()

route.get('/', getProjects)
route.post('/', createProject)
route.get('/:projectId/runs', getProjectRuns)

export default route
