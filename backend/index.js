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

function isMissingTimestamp(timestamp) {
  return (
    timestamp === null ||
    timestamp === undefined ||
    timestamp === "" ||
    String(timestamp).trim().toLowerCase() === "null"
  );
}

function cleanTimestamp(timestamp) {
  if (isMissingTimestamp(timestamp)) return null;

  const match = String(timestamp)
    .replace(/[[\]]/g, "")
    .match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/);

  return match ? match[1] : String(timestamp).trim();
}

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTranscriptSegments(transcript) {
  const segments = [];
  const segmentPattern =
    /\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([\s\S]*?)(?=\s*\[\d{1,2}:\d{2}(?::\d{2})?\]\s*|$)/g;

  for (const match of transcript.matchAll(segmentPattern)) {
    segments.push({
      timestamp: match[1],
      text: match[2].trim(),
      normalizedText: normalizeText(match[2]),
    });
  }

  return segments;
}

function findTimestampForFallacy(fallacy, transcriptSegments) {
  const searchText = normalizeText(
    fallacy.quote ||
      fallacy.excerpt ||
      fallacy.contextDescription ||
      fallacy.claim ||
      fallacy.explanation
  );

  if (!searchText) return null;

  const directMatch = transcriptSegments.find(
    (segment) =>
      segment.normalizedText.includes(searchText) ||
      searchText.includes(segment.normalizedText)
  );

  if (directMatch) return directMatch.timestamp;

  const queryWords = new Set(
    searchText
      .split(" ")
      .filter((word) => word.length > 3)
  );

  let bestSegment = null;
  let bestScore = 0;

  for (const segment of transcriptSegments) {
    const segmentWords = new Set(segment.normalizedText.split(" "));
    let score = 0;

    for (const word of queryWords) {
      if (segmentWords.has(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSegment = segment;
    }
  }

  return bestScore >= 2 ? bestSegment.timestamp : null;
}

function normalizeVideoAnalysisTimestamps(analysis, transcript) {
  const transcriptSegments = parseTranscriptSegments(transcript);
  const possibleFallacies =
    analysis?.possible_fallacies ||
    analysis?.fallacies ||
    analysis?.analysis?.fallacies ||
    [];

  return {
    ...analysis,
    possible_fallacies: possibleFallacies.map((fallacy) => {
      const timestamp =
        cleanTimestamp(
          fallacy.timestamp ??
            fallacy.time_stamp ??
            fallacy.timeStamp ??
            fallacy.start ??
            fallacy.time ??
            fallacy.seconds ??
            fallacy.quote ??
            fallacy.excerpt ??
            fallacy.contextDescription
        ) || findTimestampForFallacy(fallacy, transcriptSegments);

      return {
        ...fallacy,
        timestamp,
      };
    }),
  };
}

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
    const rawAnalysis = await analyzeLogic(transcript);
    const analysis = normalizeVideoAnalysisTimestamps(rawAnalysis, transcript);

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
