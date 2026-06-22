"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TestRunSchema = new mongoose_1.Schema({
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, "Project refrence is required"]
    },
    status: {
        type: String,
        enum: ['PASSED', 'FAILED'],
        required: true,
    },
    mismatchPercentage: { type: Number, required: true },
    totalPixelsCompared: { type: Number, required: true },
    mismatchPixelsCount: { type: Number, required: true },
    stagingScreenshotUrl: { type: String, required: true },
    productionScreenshotUrl: { type: String, required: true },
    diffScreenshotUrl: { type: String, required: true },
    visualBugs: [
        {
            element: { type: String, required: true },
            description: { type: String, required: true },
            location: {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
                width: { type: Number, required: true },
                height: { type: Number, required: true }
            },
            aiSuggestion: {
                explanation: { type: String },
                cssFix: { type: String },
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = (0, mongoose_1.model)('TestRun', TestRunSchema);
