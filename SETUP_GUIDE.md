# Extension + Backend Integration Setup Guide

## What I Fixed

### 1. **Port Configuration (3000)**
   - Updated `backend/.env` to use `PORT=3000`
   - Updated `extension/popup.js` to call `localhost:3000` instead of `3001`
   - Updated `extension/manifest.json` to allow `localhost:3000` and `3001`

### 2. **Extension Popup UI Integration**
   - Modified `extension/popup.html` to properly load the React app directly in the popup
   - Updated `extension/src/App.jsx` to include the "Analyze Video" button directly in the React component
   - Analysis logic is now built into the React app instead of a separate popup.js

### 3. **Vite Configuration**
   - Updated `extension/vite.config.js` to properly bundle for Chrome extension popup
   - Added proper entry point configuration for the popup.html file

### 4. **Communication Flow**
   - Extension popup → Backend `/analyze-video` endpoint
   - Backend returns analysis data
   - React components display results in the extension popup
   - Results sent to content script for YouTube video integration

## How to Run Everything

### Step 1: Install Backend Dependencies
```bash
cd /Users/srabmazumdar/Code/MPC-Hacks/backend
npm install
```

### Step 2: Start the Backend Server
```bash
cd /Users/srabmazumdar/Code/MPC-Hacks/backend
npm run dev  # or npm start
```
Backend will run on `http://localhost:3000`

### Step 3: Build the Extension
```bash
cd /Users/srabmazumdar/Code/MPC-Hacks/extension

npm install
npm run build
```

### Step 4: Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Navigate to `/Users/srabmazumdar/Code/MPC-Hacks/extension/dist` and select it
5. The "Therefore" extension should appear in your Chrome toolbar

### Step 5: Test the Extension
1. Go to any YouTube video
2. Click the "Therefore" extension icon
3. Click "Analyze Video" button in the popup
4. The backend will:
   - Extract the video transcript
   - Analyze it for logical fallacies
   - Return results to the extension popup
5. View the analysis in the extension popup with:
   - Logic Score
   - Logic Summary
   - Fallacy Timeline
   - What Works/Doesn't Work
   - Hidden Assumptions
   - Reasoning Improvements

## File Changes Summary

| File | Change |
|------|--------|
| `backend/.env` | PORT changed from 3001 → 3000 |
| `extension/manifest.json` | Added localhost:3001 permission |
| `extension/popup.html` | Removed inline button, now uses React |
| `extension/popup.js` | Changed port from 3001 → 3000 |
| `extension/vite.config.js` | Added proper rollup config for popup |
| `extension/src/App.jsx` | Added analyze button and logic directly in React |

## Troubleshooting

### Extension doesn't load
- Make sure backend is running on `http://localhost:3000`
- Check Chrome console for errors (Right-click extension → Inspect popup)

### "Analyze Video" button doesn't work
- Verify backend is running: `http://localhost:3000/` should return "Backend is working"
- Check browser console for network errors
- Ensure you're on a YouTube video page

### Analysis data not displaying
- Check that backend returns valid JSON with `analysis` field
- Verify component files exist in `extension/src/components/`

## Development Mode

For active development, you can run the extension in dev mode:
```bash
cd /Users/srabmazumdar/Code/MPC-Hacks/extension
npm run dev
```
This will start a dev server at `http://localhost:5173` for faster rebuilding.
