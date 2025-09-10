# Kreativium - AI-Powered Session Tracker

This is a single-page application designed to track student sessions, visualize behavioral and sensory data, and generate AI-powered insights and recommendations.

## Features

*   **Session Tracking**: Log detailed observations including emotions, sensory levels, triggers, and actions.
*   **Data Visualization**: View trends and patterns across sessions in the Reports dashboard.
*   **AI Analysis**: Generate a detailed analysis of session data to identify patterns, triggers, and get actionable recommendations.
*   **AI Coach**: Get concise, actionable tips based on session analysis.
*   **Export & Share**: Export data to CSV, print reports to PDF, and share links to insights.
*   **Privacy-Focused**: Attachments (images/audio) are handled in-session and are not persisted to storage.

**Note on AI:** The AI analysis feature in this version uses a local, deterministic stub (`services/api.ts` and `services/coach.ts`) and does not connect to a live Large Language Model.

## Tech Stack

*   React 19
*   TypeScript
*   Zustand for state management
*   Tailwind CSS for styling (via CDN)
*   No external component libraries (all primitives are custom)
*   Vite for development and bundling (assumed)

---

## Getting Started

### Prerequisites

*   Node.js (v20 LTS recommended)
*   npm (or your preferred package manager)
*   Docker (for containerized deployment)

### Installation & Running Locally

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if specified by Vite).

### Building for Production

1.  **Build the static assets:**
    ```bash
    npm run build
    ```
    This will create a `dist/` directory with the optimized production assets.

2.  **Preview the production build:**
    ```bash
    npm run preview
    ```
    This command serves the `dist/` folder locally to test the production build.

---

## Deployment (Cloud Run / Docker)

The application is configured for easy deployment as a container.

1.  **Build the Docker image:**
    ```bash
    docker build -t kreativium-app .
    ```

2.  **Run the container locally:**
    ```bash
    docker run -p 8080:8080 -e PORT=8080 kreativium-app
    ```
    The application will be served by the minimal Node.js server and accessible at `http://localhost:8080`. The `/healthz` endpoint can be used for health checks.

3.  **Deploy to Cloud Run:**
    You can push the container image to a registry (like Google Artifact Registry) and deploy it to Cloud Run. The included `Dockerfile` is optimized for this workflow.
