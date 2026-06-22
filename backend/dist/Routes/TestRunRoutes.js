"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TestRunControllers_1 = require("../Controllers/TestRunControllers");
const ProjectControllers_1 = require("../Controllers/ProjectControllers");
const route = express_1.default.Router();
route.get('/run/:runId', ProjectControllers_1.getTestRunById);
route.post('/test-capture', TestRunControllers_1.runTestCapture);
route.post('/run/:runId/chat', ProjectControllers_1.askSpectreChat);
exports.default = route;
