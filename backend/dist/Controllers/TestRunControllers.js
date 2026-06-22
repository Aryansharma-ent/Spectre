"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestCapture = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const photographer_1 = __importDefault(require("../services/photographer"));
const spotter_1 = __importDefault(require("../services/spotter"));
const TestRun_1 = __importDefault(require("../models/TestRun"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Project_1 = __importDefault(require("../models/Project"));
const consultant_1 = require("../services/consultant");
/* @desc : POST request to send StagingURL and ProductionURL to the server
   @route : POST /api/test-capture
   @access : Public
*/
exports.runTestCapture = (0, express_async_handler_1.default)(async (req, res) => {
    const { stagingUrl, productionUrl } = req.body;
    if (!stagingUrl || !productionUrl) {
        res.status(400);
        throw new Error("Missing stagingUrl or productionUrl. Please supply both in the request body.");
    }
    console.log(` Spectre AI: Dispatched visual comparison scan...`);
    console.log(`   Staging:    ${stagingUrl}`);
    console.log(`   Production: ${productionUrl}`);
    // The Photographer snaps the screenshots in-memory 
    const stagingBuffer = await (0, photographer_1.default)(stagingUrl);
    const productionBuffer = await (0, photographer_1.default)(productionUrl);
    // random testrunid
    const testRunId = `run_${Math.random().toString(36).substring(2, 11)}`;
    // unique filenames and paths for our image files
    const stagingFilename = `${testRunId}_staging.png`;
    const productionFilename = `${testRunId}_production.png`;
    const diffFilename = `${testRunId}_diff.png`;
    // Screenshot directory and file paths 
    const screenshotsDir = path_1.default.join(__dirname, '../../Public/screenshots');
    const stagingPath = path_1.default.join(screenshotsDir, stagingFilename);
    const productionPath = path_1.default.join(screenshotsDir, productionFilename);
    let diffPath = path_1.default.join(screenshotsDir, diffFilename);
    // making sure the screenshot directory exist else we need to create it
    if (!fs_1.default.existsSync(screenshotsDir)) {
        fs_1.default.mkdirSync(screenshotsDir, { recursive: true });
    }
    //  Save the staging & production screenshots from RAM onto the disk. We need them to serve the frontend
    fs_1.default.writeFileSync(stagingPath, stagingBuffer.buffer);
    fs_1.default.writeFileSync(productionPath, productionBuffer.buffer);
    // Comparing the result using the service we created
    const compareResult = (0, spotter_1.default)(stagingBuffer.buffer, productionBuffer.buffer, diffPath, stagingBuffer.layout);
    console.log(`Compare Results:`);
    console.log(`   Mismatch Percentage: ${compareResult.mismatchPercentage}%`);
    console.log(`   Mismatched Pixels:   ${compareResult.mismatchPixels}`);
    let project = await Project_1.default.findOne({ name: 'Default Demo Project' });
    if (!project) {
        project = await Project_1.default.create({
            name: "Default Demo Project",
            stagingUrl,
            productionUrl
        });
    }
    // looping through all the visual bugs and sending each element to LLM model for fix suggestions
    const visualBugsWithAi = [];
    for (const bug of compareResult.visualBugs) {
        const aiSuggestion = await (0, consultant_1.genAiFixSuggestion)(bug.element, bug.outerHtml, bug.description);
        visualBugsWithAi.push({
            element: bug.element,
            description: bug.description,
            location: bug.location,
            aiSuggestion
        });
    }
    // Create and saving it in TestRun database entries
    const testRun = await TestRun_1.default.create({
        projectId: project._id,
        status: compareResult.mismatchPercentage > 0 ? 'FAILED' : 'PASSED',
        mismatchPixelsCount: compareResult.mismatchPixels,
        mismatchPercentage: compareResult.mismatchPercentage,
        totalPixelsCompared: compareResult.totalPixels,
        stagingScreenshotUrl: `/screenshots/${stagingFilename}`,
        productionScreenshotUrl: `/screenshots/${productionFilename}`,
        diffScreenshotUrl: `/screenshots/${diffFilename}`,
        visualBugs: visualBugsWithAi
    });
    res.status(200).json({
        success: true,
        message: "Visual regression comparison completed successfully",
        data: testRun
    });
});
