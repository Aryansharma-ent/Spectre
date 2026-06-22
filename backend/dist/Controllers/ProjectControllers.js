"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askSpectreChat = exports.getTestRunById = exports.getProjectRuns = exports.getProjects = void 0;
const TestRun_1 = __importDefault(require("../models/TestRun"));
const Project_1 = __importDefault(require("../models/Project"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generative_ai_1 = require("@google/generative-ai");
exports.getProjects = (0, express_async_handler_1.default)(async (req, res) => {
    const projects = await Project_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});
exports.getProjectRuns = (0, express_async_handler_1.default)(async (req, res) => {
    const { projectId } = req.params;
    const project = await TestRun_1.default.find({ projectId }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: project
    });
});
exports.getTestRunById = (0, express_async_handler_1.default)(async (req, res) => {
    const { runId } = req.params;
    const Testrun = await TestRun_1.default.findById(runId);
    if (!Testrun) {
        res.status(404);
        throw new Error("Test run not Found");
    }
    res.status(200).json({
        success: true,
        data: Testrun
    });
});
exports.askSpectreChat = (0, express_async_handler_1.default)(async (req, res) => {
    const { runId } = req.params;
    const { message, history } = req.body; // Extract user message & history from body
    if (!message) {
        res.status(400);
        throw new Error("Message is required in the request body.");
    }
    const Testrun = await TestRun_1.default.findById(runId);
    if (!Testrun) {
        res.status(404);
        throw new Error("Test run not found");
    }
    const api = process.env.GEMINI_API_KEY;
    if (!api) {
        res.status(404);
        throw new Error("API key not configured");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(api);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Or gemini-2.5-flash
    // 1. Construct systemInstruction (your string interpolation template here...)
    const systemInstruction = `
You are Spectre AI, an expert frontend CSS and layout debugging assistant.
The user is viewing a visual regression test run report for their web application and wants to discuss the visual bugs found.

Here is the context of the test run:
- Test Run ID: ${Testrun._id}
- Status: ${Testrun.status}
- Mismatch Percentage: ${Testrun.mismatchPercentage}%
- Mismatch Pixels: ${Testrun.mismatchPixelsCount} of ${Testrun.totalPixelsCompared} total pixels

Here are the visual bugs identified during this run:
${Testrun.visualBugs.map((bug, index) => `
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
    // 2. Start Gemini Multi-turn Chat
    const chat = model.startChat({
        history: history || [], // Array of previous messages
        systemInstruction: systemInstruction
    });
    // 3. Send the user's new message to the chat
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();
    // 4. Return the raw text reply to the client
    res.status(200).json({
        success: true,
        message: responseText
    });
});
