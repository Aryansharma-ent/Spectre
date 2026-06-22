import { Request,Response } from "express";
import AsyncHandler from 'express-async-handler'
import mongoose from "mongoose";
import  captureScreenshot  from '../services/photographer'; 
import  CompareScreenshots  from '../services/spotter';
import TestRun from "../models/TestRun";
import fs from 'fs'
import path from "path";
import Project from "../models/Project";
import { genAiFixSuggestion } from "../services/consultant";


/* @desc : POST request to send StagingURL and ProductionURL to the server
   @route : POST /api/test-capture
   @access : Public 
*/

const runBackgroundCapture = async (
  dbRecordId: string,
  stagingUrl: string,
  productionUrl: string,
  testRunId: string
) => {
  try {
    // 1. The Photographer snaps screenshots in-memory
    const stagingBuffer = await captureScreenshot(stagingUrl);
    const productionBuffer = await captureScreenshot(productionUrl);

    // 2. Establish file directories and unique filenames
    const stagingFilename = `${testRunId}_staging.png`;
    const productionFilename = `${testRunId}_production.png`;
    const diffFilename = `${testRunId}_diff.png`;

    const screenshotsDir = path.join(__dirname, '../../Public/screenshots');
    const stagingPath = path.join(screenshotsDir, stagingFilename);
    const productionPath = path.join(screenshotsDir, productionFilename);
    const diffPath = path.join(screenshotsDir, diffFilename);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // 3. Write the image buffers from RAM onto the disk
    fs.writeFileSync(stagingPath, stagingBuffer.buffer);
    fs.writeFileSync(productionPath, productionBuffer.buffer);

    // 4. Compare screenshots and get pixel regressions (Spotter service)
    const compareResult = CompareScreenshots(
      stagingBuffer.buffer,
      productionBuffer.buffer,
      diffPath,
      stagingBuffer.layout
    );

    // 5. Query Gemini AI for CSS suggestions (Consultant service) - capped at first 5 to protect quota
    const visualBugsWithAi = [];
    for (let i = 0; i < compareResult.visualBugs.length; i++) {
      const bug = compareResult.visualBugs[i];
      let aiSuggestion;
      
      if (i < 5) {
        aiSuggestion = await genAiFixSuggestion(bug.element, bug.outerHtml, bug.description);
      }
      
      visualBugsWithAi.push({
        element: bug.element,
        description: bug.description,
        location: bug.location,
        aiSuggestion
      });
    }

    // 6. Update the MongoDB document with the finished results!
    await TestRun.findByIdAndUpdate(dbRecordId, {
      status: compareResult.mismatchPercentage > 0 ? 'FAILED' : 'PASSED',
      mismatchPixelsCount: compareResult.mismatchPixels,
      mismatchPercentage: compareResult.mismatchPercentage,
      totalPixelsCompared: compareResult.totalPixels,
      visualBugs: visualBugsWithAi
    });

    console.log(`Visual comparison completed successfully for DB Record: ${dbRecordId}`);

  } catch (error) {
    console.error(` Error during background capture for DB: ${dbRecordId}`, error);
    
    // Fail-safe: Update status to FAILED in the DB so the frontend knows the process stopped
    await TestRun.findByIdAndUpdate(dbRecordId, {
      status: 'FAILED',
      mismatchPercentage: 100,
      totalPixelsCompared: 0,
      mismatchPixelsCount: 0,
      visualBugs: []
    }).catch(dbErr => console.error("Failed to save error status to database:", dbErr));
  }
};




 export const runTestCapture = AsyncHandler(async(req : Request,res : Response): Promise<void> => {
     const {stagingUrl,productionUrl,projectId} = req.body

     if(!stagingUrl || !productionUrl){
        res.status(400)
        throw new Error("Missing stagingUrl or productionUrl. Please supply both in the request body.")
     }

      console.log(` Spectre AI: Dispatched visual comparison scan...`);
      console.log(`   Staging:    ${stagingUrl}`);
      console.log(`   Production: ${productionUrl}`);
     
  let project;
  if (projectId) {
    project = await Project.findById(projectId);
  }
  if (!project) {
    project = await Project.findOne({ name: 'Default Demo Project' });
  }
  if (!project) {
    project = await Project.create({
      name: "Default Demo Project",
      stagingUrl,
      productionUrl
    });
  }
  // 2. Generate random testrunid for file naming
  const testRunId = `run_${Math.random().toString(36).substring(2, 11)}`;
  const stagingFilename = `${testRunId}_staging.png`;
  const productionFilename = `${testRunId}_production.png`;
  const diffFilename = `${testRunId}_diff.png`;
  // 3. Create the initial TestRun database entry with status 'RUNNING' and placeholder metrics
  const testRun = await TestRun.create({
    projectId: project._id as mongoose.Types.ObjectId,
    status: 'RUNNING',
    mismatchPixelsCount: 0,
    mismatchPercentage: 0,
    totalPixelsCompared: 0,
    stagingScreenshotUrl: `/screenshots/${stagingFilename}`,
    productionScreenshotUrl: `/screenshots/${productionFilename}`,
    diffScreenshotUrl: `/screenshots/${diffFilename}`,
    visualBugs: []
  });
  // 4. Return instant 200 response so frontend displays the pulsing 'RUNNING' card immediately
 
   res.status(200).json({
     success: true,
     message: "Visual regression comparison completed successfully",
     data: testRun
   });


     runBackgroundCapture(
     (testRun._id as mongoose.Types.ObjectId).toString(),
     stagingUrl,
     productionUrl,
     testRunId
   );
  

  })






 export const rerunTestCapture = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { runId } = req.params;

  // 1. Find the existing test run
  const testRun = await TestRun.findById(runId);
  if (!testRun) {
    res.status(404);
    throw new Error("Test run not found");
  }

  // 2. Resolve the parent project to fetch staging & production URLs
  const project = await Project.findById(testRun.projectId);
  if (!project) {
    res.status(404);
    throw new Error("Linked project details not found");
  }

  // 3. Reset the document status in MongoDB back to 'RUNNING' and clear old statistics
  testRun.status = 'RUNNING';
  testRun.visualBugs = [];
  testRun.mismatchPercentage = 0;
  testRun.mismatchPixelsCount = 0;
  testRun.totalPixelsCompared = 0;
  await testRun.save();

  // 4. Return instant response so the frontend shows the loader instantly
  res.status(200).json({
    success: true,
    message: "Visual comparison scan restarted successfully in background",
    data: testRun
  });

  // 5. Extract the existing screenshot filename prefix (e.g. from "/screenshots/run_v0doyrnly_staging.png")
  // so we overwrite the exact same files on disk
  const filename = path.basename(testRun.stagingScreenshotUrl); // e.g. "run_v0doyrnly_staging.png"
  const testRunId = filename.substring(0, filename.indexOf('_')); // e.g. "run_v0doyrnly"

  // 6. Spawn the background capture process using the same URLs and file prefix
  runBackgroundCapture(
    testRun._id.toString(),
    project.stagingUrl,
    project.productionUrl,
    testRunId
  );
});