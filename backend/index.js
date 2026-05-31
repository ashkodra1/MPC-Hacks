import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { analyzeLogic } from "./geminiService.js";
import { getYoutubeTranscript } from "./youtubeTranscript.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "No argument text provided",
      });
    }

    const analysis = await analyzeLogic(text);

    res.json({
      input: text,
      analysis,
    });
  } catch (error) {
    console.error("Analyze error:", error);

    res.status(500).json({
      error: "Failed to analyze argument",
      details: error.message,
    });
  }
});

app.post("/transcript", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({
        error: "No YouTube URL provided",
      });
    }

    const result = await getYoutubeTranscript(url);

    res.json(result);
  } catch (error) {
    console.error("Transcript error:", error);

    res.status(500).json({
      error: "Failed to fetch transcript",
      details: error.message,
    });
  }
});

app.post("/analyze-video", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({
        error: "No YouTube URL provided",
      });
    }

    console.log("[analyze-video] Fetching transcript from:", url);
    const { videoId, transcript } = await getYoutubeTranscript(url);
    
    console.log("[analyze-video] Transcript length:", transcript.length);
    console.log("[analyze-video] Analyzing logic...");
    const analysis = await analyzeLogic(transcript);

    console.log("[analyze-video] videoId:", videoId);
    console.log(
      "[analyze-video] analysis:",
      JSON.stringify(analysis, null, 2)
    );

    res.json({
      videoId,
      analysis,
    });
  } catch (error) {
    console.error("Analyze video error:", error);

    res.status(500).json({
      error: "Failed to analyze video",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});