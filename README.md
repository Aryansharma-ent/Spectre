# 🕵️‍♂️ Spectre AI (Visual Regression Debugger)

**Spectre AI** is a modern, developer-focused Visual Regression Debugger. It allows developers to compare their **Staging** and **Production** website URLs pixel-by-pixel, instantly highlighting visual layout bugs and utilizing **Gemini AI** to suggest the exact CSS code fixes in a dynamic sidebar.

No more manual QA testing or missing broken layouts during deployments. Spectre AI automates visual debugging with pixel-perfect accuracy.

---

## 🏗️ System Architecture & "Cast of Characters"

Spectre AI is built using a coordinated multi-agent architecture. Here is how the request flows through our system:

```text
┌────────────────────────────────────────────────────────┐
│               THE CLIENT (React Frontend)              │
│       "The Front Desk" where developers buy tickets,   │
│           type URLs, and view visual reports.          │
└──────────────────────────┬─────────────────────────────┘
                           │ 1. Submits Test Request (URLs)
                           ▼
┌────────────────────────────────────────────────────────┐
│               THE DETECTIVE (Node/Express)             │
│        The coordinator who receives the request and    │
│        tells the specialist agents what to do.         │
└──────────────────────────┬─────────────────────────────┘
                           │ 2. Dispatches Specialist Agents
                           ▼
 ┌─────────────────────────┼────────────────────────────┐
 │                         │                            │
 ▼                         ▼                            ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ THE PHOTOGRAPHER│       │ THE SPOTTER     │       │ THE CONSULTANT  │
│  (Puppeteer)    │       │  (Pixelmatch)   │       │   (Gemini AI)   │
│ Takes picture   │       │ Compares images │       │ Analyzes errors │
│ of both sites.  │       │ & circles bugs. │       │ & writes code.  │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │ 3. Saves Case Files
                                   ▼
                        ┌─────────────────────┐
                        │  THE FILE CABINET   │
                        │      (MongoDB)      │
                        │ Stores project keys │
                        │  & history records. │
                        └─────────────────────┘
```

### 👥 The Specialist Team Roles
* **The Client (React / TypeScript)**: The visual frontend dashboard. It collects the testing URLs and displays visual diff reports with an interactive slider.
* **The Detective (Node.js / Express)**: The central orchestrator server. It exposes the API endpoints, receives the request, and manages the execution flow.
* **The Photographer (Puppeteer)**: The browser automation specialist. It spawns a headless Chrome browser, visits the Staging & Production URLs, and snaps screenshots.
* **The Spotter (Pixelmatch)**: The pixel-comparison engine. It overlays the two screenshots, highlights mismatches in neon pink, and calculates the difference percentage.
* **The Consultant (Gemini AI)**: The intelligent assistant. It analyzes the visual difference coordinates alongside HTML/CSS layout files and provides the exact CSS code block needed to fix the bug.
* **The File Cabinet (MongoDB)**: The secure storage drawer. It stores historic visual test runs, difference reports, and user project details.

---

## ⚖️ Spectre AI vs. Traditional Visual Testing (Why Spectre AI?)

Traditional visual testing platforms (like Percy or Chromatic) are **passive detectors**—they alert you *if* a layout is broken but leave you to figure out *why* and *how* to fix it. Spectre AI is an **active visual debugger** that maps pixel shifts directly to DOM element selectors and automatically writes the CSS overrides to fix them.

### Comparison Matrix

| Feature | Percy / Chromatic | Playwright / Cypress | **Spectre AI (Our Project)** |
| :--- | :--- | :--- | :--- |
| **Primary Goal** | **Detection**: Alert if screenshots differ. | **Assertion**: Fail pipeline if page changes. | **Debugging**: Detect, locate DOM nodes, and write the fix. |
| **Output** | Flat, static PNG difference mask. | Static local diff image file. | **Interactive DOM inspector** with selector highlights. |
| **Root Cause Analysis**| ❌ None. You must open DevTools manually. | ❌ None. | **AI-powered**: Explains the cause of layout shifts. |
| **Styling Fixes** | ❌ None. | ❌ None. | **Automatic CSS Generation**: Exact copy-pasteable overrides. |
| **Interactive Help** | ❌ None. | ❌ None. | **Ask Spectre**: Context-aware multi-turn AI chat debugger. |
| **Sandbox Preview** | ❌ None. | ❌ None. | **Live Style Injection**: Real-time styling sandbox test. |

---

## 🛠️ The Technology Stack

* **Frontend**: React.js, TailwindCSS, TypeScript (Modern, responsive dashboard interface)
* **Backend**: Node.js, Express.js, TypeScript (Robust, type-safe REST API server)
* **Database**: MongoDB, Mongoose (Document store for saving test runs and history)
* **Automation**: Puppeteer (Headless browser automation)
* **Image Processing**: Pixelmatch (High-performance pixel difference algorithm)
* **Artificial Intelligence**: Gemini API (LLM analysis for automated style recommendations)

---

## 🚀 Project Roadmap & Milestones

### 📍 Milestone 1: Server Initialization (Complete)
* [x] Create project structure and initialize Node.js / TypeScript environment.
* [x] Build the **Detective** Express backend server.
* [x] Implement the `/api/test-capture` mock endpoint.
* [x] Verify local execution and JSON response structure.

### 📍 Milestone 2: The Photographer & Spotter (Visual Comparison Engine) (Complete)
* [x] Integrate **Puppeteer** to dynamically take live screenshots of website URLs.
* [x] Integrate **Pixelmatch** to perform pixel-by-pixel comparisons.
* [x] Generate and save the visual "diff" output image showing the mismatch.

### 📍 Milestone 3: The Consultant (Gemini AI Integration) (Complete)
* [x] Connect the backend to the **Gemini API**.
* [x] Formulate prompts that feed structural visual data to Gemini.
* [x] Return accurate, clean CSS solutions for discovered visual mismatches.

### 📍 Milestone 4: The File Cabinet (Database Persistence) (Complete)
* [x] Initialize **MongoDB** database schemas for saving historical test records.
* [x] Save visual screenshots and results, enabling developers to look back at past test reports.
* [x] Expose endpoints for project history and the multi-turn "Ask Spectre" Chat Assistant.

### 📍 Milestone 5: The Client (Stunning Dashboard UI) (Pending)
* [ ] Build a sleek React frontend.
* [ ] Create an interactive "before/after/diff" image slider.
* [ ] Add the AI Sidebar that displays Gemini's CSS recommendations with one-click copy.

### 📍 Milestone 6: CI/CD Pipeline & CLI Automation (Pending)
* [ ] Implement API key project authentication on the backend.
* [ ] Write a lightweight Node.js CLI tool to trigger visual tests from the terminal.
* [ ] Setup Webhook integrations and GitHub Action YAML workflows.

---

## 💻 Getting Started (Backend Development)

### Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "PixelMatch Saas/backend"
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Start the server in development mode (with hot-reloading active):
   ```bash
   npm run dev
   ```

The backend server will start on port `5000`. You can verify it is active by opening `http://localhost:5000/` in your browser.

---

## 🧪 Testing the Mock API
You can test the detective server's mock endpoint by sending a `POST` request to `http://localhost:5000/api/test-capture` with the following JSON body:

```json
{
  "stagingUrl": "https://staging.mywebsite.com",
  "productionUrl": "https://mywebsite.com"
}
```

**Example response**:
```json
{
  "success": true,
  "message": "Visual regression test completed successfully (MOCK DATA)",
  "testRunId": "run_93j8dnskq",
  "urls": {
    "staging": "https://staging.mywebsite.com",
    "production": "https://mywebsite.com"
  },
  "results": {
    "status": "FAILED",
    "mismatchPercentage": 1.45,
    "totalPixelsCompared": 1024000,
    "mismatchPixelsCount": 14848,
    "screenshotUrls": {
      "staging": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
      "production": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
      "diff": "https://images.unsplash.com/photo-1557683316-973673baf926?w=800"
    },
    "visualBugs": [
      {
        "element": "button.hero-cta",
        "description": "Button background color shifted from Indigo to Ocean Blue, and moved 5px to the right.",
        "aiSuggestion": {
          "explanation": "The Staging site style class has an incorrect utility class `bg-cyan-500` instead of `bg-indigo-600`.",
          "cssFix": ".hero-cta {\n  background-color: #4f46e5 !important;\n  margin-left: 0px !important;\n}"
        }
      }
    ]
  }
}
```
