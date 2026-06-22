"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pngjs_1 = require("pngjs");
const pixelmatch_1 = __importDefault(require("pixelmatch"));
/*
  Compares to two image buffers to generate mismatchPixels,mismatchPercentage and totalpixels
  @param stagingBuffer : Staging image binary data
  @param productionBuffer : Production image binary data
  @param diffOutputPath : given path to store the difference neon-pink image
*/
const CompareScreenshots = (stagingBuffer, productionBuffer, diffOutputPath, stagingLayout) => {
    const stagingPng = pngjs_1.PNG.sync.read(stagingBuffer);
    const productionPng = pngjs_1.PNG.sync.read(productionBuffer);
    const { width, height } = stagingPng;
    const diffPng = new pngjs_1.PNG({ width, height });
    const mismatchPixels = (0, pixelmatch_1.default)(stagingPng.data, productionPng.data, diffPng.data, width, height, { threshold: 0.1 });
    fs_1.default.writeFileSync(diffOutputPath, pngjs_1.PNG.sync.write(diffPng));
    // We need to loop through every pixel (y from 0 to height, x from 0 to width).
    // For each pixel, find the index inside stagingPng.data (idx = (width * y + x) * 4).
    // Check the difference in R, G, B colors. If the difference is > 45, loop through stagingLayout
    // and check if the pixel (x, y) falls inside the element's box.
    const elementMismatchCounts = {};
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (width * y + x) << 2; // multiply by 4
            const rDiff = Math.abs(stagingPng.data[idx] - productionPng.data[idx]);
            const gDiff = Math.abs(stagingPng.data[idx + 1] - productionPng.data[idx + 1]);
            const bDiff = Math.abs(stagingPng.data[idx + 2] - productionPng.data[idx + 2]);
            /*     FLAT ARRAY MAPPING: (width * y + x) << 2
                       - y is the row, x is the column.
                       - "width * y" skips all the pixels in the rows above us (like an elevator).
                       - "+ x" moves us right to the correct column (like a walkway).
                       - "<< 2" is a fast bitwise operation that multiplies by 4.
                         We multiply by 4 because each pixel takes up 4 slots in the flat array
                         for Red, Green, Blue, and Alpha (RGBA).
                       
                    2. RGB COLOR DIFFERENCE:
                       - Every color on a screen is made of Red, Green, and Blue values (0 to 255).
                       - We calculate the absolute difference for each color channel (rDiff, gDiff, bDiff)
                         between Staging and Production.
           */
            // if there is difference in color
            if (rDiff + gDiff + bDiff > 45) {
                // check where this pixel belongs to i.e. html element
                for (const el of stagingLayout) {
                    const { x: elX, y: elY, width: elW, height: elH } = el.box;
                    if (x >= elX && x <= elX + elW && y >= elY && y <= elY + elH) {
                        elementMismatchCounts[el.selector] = (elementMismatchCounts[el.selector] || 0) + 1;
                    }
                }
            }
        }
    }
    // filtering out elements that have more than 15 mismatched pixels and add them to visualBugs
    const visualBugs = [];
    for (const el of stagingLayout) {
        const badPixelsCount = elementMismatchCounts[el.selector] || 0;
        if (badPixelsCount > 15) {
            visualBugs.push({
                element: el.selector,
                description: `Visual shift/color diff detected: ${badPixelsCount} pixels mismatch.`,
                location: el.box,
                outerHtml: el.outerHtml,
            });
        }
    }
    const totalPixels = height * width;
    const mismatchPercentage = parseFloat(((mismatchPixels / totalPixels) * 100).toFixed(2));
    return {
        mismatchPixels,
        mismatchPercentage,
        totalPixels,
        visualBugs
    };
};
exports.default = CompareScreenshots;
