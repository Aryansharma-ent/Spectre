# 🕵️‍♂️ Spectre AI — Visual Regression Debugger

This file tracks the current state of development, architectural decisions, and next steps.

---

## 📍 Current Phase: Milestone 2 — The Photographer & The Spotter (Visual Engine)
We are building the core visual engine of **Spectre AI (The Visual Regression Debugger)**. Unlike traditional testers that only report *if* a layout is broken, Spectre AI acts as a **debugger**: it captures visual states, maps layout differences directly to HTML elements, and integrates Gemini AI to provide actionable CSS bug-fixes.

---

## ✅ Completed Tasks

### Milestone 1: Server Initialization & Architecture Setup
* **Project Folder Rename**: Renamed workspace to `Spectre AI Saas`.
* **Database Setup**: Configured connection to MongoDB Atlas cloud cluster (`/PixelMatch` database) inside `src/config/db.ts` using the async/await pattern.
* **Env Config**: Created `.env` with variables `MONGO_URL` and `PORT` for security.
* **Mongoose Models**:
  * `src/models/Project.ts`: Schema for storing website testing endpoints (`stagingUrl` and `productionUrl`) using camelCase fields.
  * `src/models/TestRun.ts`: Schema for storing detailed visual comparison results, screenshot paths, and visual bug coordinate maps.
* **Modular Router**:
  * `src/Controllers/TestRunControllers.ts`: Controller containing the request logic, wrapped in `express-async-handler` for async safety.
  * `src/Routes/TestRunRoutes.ts`: Router mapping `/test-capture` to the controller.
* **Error Handling**:
  * `src/Middlewares/ErrorHandler.ts`: Global Express error-handling middleware that catches thrown exceptions and returns them as clean JSON responses.
  * `src/server.ts`: Mounted routes under `/api/tests` and registered the global error handler.

### Milestone 2: The Photographer & The Spotter (Visual Engine)
* **Local Storage & Static Serving**: Created the `Public/screenshots` folder and registered static file serving on `/screenshots` in `server.ts`.
* **The Photographer service**: Built `src/services/photographer.ts` to spawn headless browser instances and capture full-page screenshots as in-memory binary Buffers.
* **The Spotter service**: Built `src/services/spotter.ts` using `pixelmatch` and `pngjs` to decode screenshot Buffers, run pixel-level comparisons, and write the diff image to disk.
* **Database Integration**: Updated `TestRunControllers.ts` to save live visual comparisons, mismatch percentages, and screenshots to the MongoDB Atlas cluster under a default project template.

### Milestone 3: The Consultant (Gemini AI Debugger Overlay)
* **API Integration**: Integrated the `@google/generative-ai` SDK and resolved ESM import-hoisting issues by lazy-loading environment variables.
* **Layout Capture**: Upgraded `photographer.ts` to extract DOM layout coordinates of elements on page load.
* **Coordinate Mapping**: Implemented pixel-to-element coordinate boundary calculations in `spotter.ts` to map visual mismatches directly to HTML elements.
* **Consultant Service**: Built `consultant.ts` to query Gemini AI with layout metadata and return clean JSON CSS overrides.
* **Controller Hookup**: Fully wired the visual engine in `TestRunControllers.ts` to run automated browser capturing, comparison mapping, and AI style debugging in one single endpoint request.

### Milestone 4: The File Cabinet (History Queries & Ask Spectre Chat Assistant)
* **Project Controllers**: Built `src/Controllers/ProjectControllers.ts` exposing endpoints to get all projects, project run histories, single test run details, and the conversational Gemini chat assistant.
* **Project Creation Route**: Added `createProject` controller to save new projects to MongoDB and registered the `POST /api/projects` endpoint in `src/Routes/ProjectRoutes.ts`.
* **Optional Project ID Support**: Updated `runTestCapture` in `src/Controllers/TestRunControllers.ts` to support an optional `projectId` parameter.
* **Route Configuration**: Created `src/Routes/ProjectRoutes.ts` and updated `src/Routes/TestRunRoutes.ts` to hook up the routes.
* **Server Mounting**: Registered all project and history routes in `server.ts` and verified successful typescript builds.

### Milestone 5: The Client UI Dashboard (Initial Integration)
* **API Endpoint Hookup**: Connected the React frontend pages to retrieve projects and test run details dynamically from the database.
* **Asynchronous Queue Integration**: Configured test run creations to instantly insert `RUNNING` status cards to the dashboard, delegate captures to the background thread, and poll for completed results.

---

## 📝 Pending Tasks (Milestone 5 — The Client UI Dashboard)

* [x] **Step 1**: Initialize the frontend React environment (Vite + TS + TailwindCSS).
* [x] **Step 2**: Build the Dashboard layouts (Header, Project Selector, Run History Sidebar).
* [x] **Step 3**: Design the Interactive Comparison Screen (Before/After side-by-side or image slider overlay).
* [x] **Step 4**: Connect frontend components to API endpoints (`GET /api/projects`, `GET /api/projects/:projectId/runs`).
* [x] **Step 5**: Build the Database-Backed Asynchronous Test Run Queue (Backend creates RUNNING state instantly, spins off Puppeteer task in background, frontend polls for status updates).
* [/] **Step 6**: Rerun Scan Button refinement (Confirming URL contexts and resolving disk file overwrites) - *Target: Tomorrow*.
* [/] **Step 7**: Build and connect the "Ask Spectre" Chat Sidebar (Gemini multi-turn history mapping, dynamic CSS markdown parser rendering) - *Target: Tomorrow*.

---

## 📝 Pending Tasks (Milestone 6 — CI/CD Pipeline & CLI Automation)

* [ ] **Step 1 (Backend)**: Add `apiKey` schema field to `Project` model and create an API Key generation endpoint.
* [ ] **Step 2 (Backend)**: Build authentication middleware to restrict test run triggers via CLI to valid API keys.
* [ ] **Step 3 (CLI)**: Write the lightweight Node.js CLI script `spectre-cli.js` to trigger scans from terminal/CI environments.
* [ ] **Step 4 (Frontend)**: Design the Developer Settings page displaying the API key generator and copy-pasteable GitHub Actions YAML scripts.
* [ ] **Step 5 (Automation)**: Set up a sample GitHub Action workflow configuration in our project repository.

---

## 🛠️ Key Architectural Decisions & Tech Stack
* **Project Name**: Spectre AI (Visual Regression Debugger)
* **Server Port**: `8000` (Defined in `.env`)
* **Routing Prefix**: `/api/tests` and `/api/projects`
* **Errors**: Managed globally via `express-async-handler` throwing straight to `ErrorHandler.ts` middleware.
* **Database**: MongoDB Atlas (`gamelogger` cluster, database `/PixelMatch`).
* **Visual Matchers**: Puppeteer (Headless Chrome) & Pixelmatch (Byte-level comparison).
* **AI Consultant**: Google Gen AI SDK (`gemini-1.5-flash` and `gemini-2.5-flash` models).
