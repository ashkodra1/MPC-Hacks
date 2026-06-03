# Therefore

Therefore is an AI-powered logical fallacy detector for YouTube videos. It helps viewers move past persuasive delivery and inspect the reasoning underneath a claim by extracting a video's transcript, analyzing it with Gemini, and presenting clear fallacy findings with quotes and explanations.

Built for MPC Hacks by four Concordia University students, the project includes a website, a Chrome extension, and an Express API that coordinates transcript retrieval and AI analysis.

## Why We Built It

Online debates, commentary videos, and educational content can sound convincing even when the reasoning is weak. Therefore was built to make critical thinking more accessible in the moment people are already watching, learning, and debating online.

The goal was not just to flag "bad arguments," but to explain why a claim may be flawed in plain language so students, creators and viewers can better evaluate persuasive content.

## Features

- Analyze a YouTube video from a pasted link in the website
- Run fallacy detection directly from a Chrome extension while browsing YouTube
- Extracted YouTube video transcripts and processed them through an AI pipeline using prompt engineering to analyze and structure content
- Identify possible logical fallacies with supporting quotes and explanations
- Display an embedded video alongside the analysis results
- Provide an extension dashboard with logic score, summary, and fallacy timeline widgets
- Persist extension analysis and customizable widget layout in local storage

## Tech Stack

- React
- TypeScript
- JavaScript
- Vite
- Express.js
- Gemini API
- Chrome Extension Manifest V3
- YouTube transcript extraction
- HTML/CSS

## Project Structure

```text
MPC-Hacks/
  backend/        Express API, Gemini integration, prompt logic, transcript handling
  extension/      Chrome extension UI, content script, and extension build output
  frontend-web/   React + TypeScript web app
  shared/         Shared project assets/placeholders
```

## How It Works

1. A user submits a YouTube URL through the web app or Chrome extension.
2. The backend fetches the video's transcript.
3. The transcript is sent to Gemini with a structured prompt for logical fallacy analysis.
4. The backend parses and normalizes the AI response into JSON.
5. Fallacy findings are returned to the frontend with labels, quotes, explanations, and timestamps.
6. The web app or extension renders the results in a format designed for quick review while watching.

## Getting Started

### Prerequisites

- Node.js
- npm
- A Gemini API key

### Backend

Create a `.env` file in `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Then run:

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

### Web App

In a separate terminal:

```bash
cd frontend-web
npm install
npm run dev
```

The website runs at:
```text
http://localhost:5173
```

### Chrome Extension

Load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click **Load unpacked**
4. Select the `extension/dist` folder
5. Start the backend locally before analyzing videos

## Team

- Allison Shkodra - Software Engineering
- Zineb Bamouh - Computer Engineering
- Srabanti Mazumdar - Software Engineering
- Salma Benlemlih - Computer Science
