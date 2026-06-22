"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectControllers_1 = require("../Controllers/ProjectControllers");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.get('/', ProjectControllers_1.getProjects);
route.get('/:projectId/runs', ProjectControllers_1.getProjectRuns);
exports.default = route;
