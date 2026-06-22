"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
    },
    stagingUrl: {
        type: String,
        required: [true, "Staging URL is required"],
        trim: true
    },
    productionUrl: {
        type: String,
        required: [true, "Production URL is required"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = (0, mongoose_1.model)('Project', ProjectModel);
