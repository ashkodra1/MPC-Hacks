import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { buildLogicPrompt } from "./logicPrompt.js";

//console.log("Gemini key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function cleanJson(text) {
  // Remove markdown code fences
  let cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  // Find first non-whitespace and attempt to extract a single JSON object/array
  const firstIdx = cleaned.search(/\S/);
  if (firstIdx === -1) return cleaned;

  const firstChar = cleaned[firstIdx];

  // If it doesn't start with { or [, return trimmed
  if (firstChar !== "{" && firstChar !== "[") {
    // try to find the first { or [ and start from there
    const altStart = Math.max(cleaned.indexOf("{"), cleaned.indexOf("["));
    if (altStart === -1) return cleaned;
    // shift start
    cleaned = cleaned.substring(altStart);
  } else {
    cleaned = cleaned.substring(firstIdx);
  }

  // If starts with { parse until matching } taking strings and escapes into account
  function findMatchingEnd(s, startChar) {
    const openChar = startChar;
    const closeChar = openChar === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];

      if (escape) {
        escape = false;
        continue;
      }

      if (ch === "\\") {
        escape = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === openChar) {
        depth++;
      } else if (ch === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
    }

    return -1;
  }

  const startChar = cleaned[0];
  const endIdx = findMatchingEnd(cleaned, startChar);

  if (endIdx !== -1) {
    const jsonStr = cleaned.substring(0, endIdx + 1);
    return jsonStr.trim();
  }

  // fallback: return original cleaned
  return cleaned;
}

export async function analyzeLogic(userText) {
  const prompt = buildLogicPrompt(userText);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const cleaned = cleanJson(response.text);
    
    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Cleaned text length:", cleaned.length);
      console.error("First 500 chars:", cleaned.substring(0, 500));
      throw new Error(
        `Failed to parse AI response as JSON: ${parseError.message}`
      );
    }
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    const message = String(error.message || "");

    if (message.includes('"code":429') || message.includes("RESOURCE_EXHAUSTED")) {
      const retryDelay = message.match(/"retryDelay":"([^"]+)"/)?.[1];
      const retryHint = retryDelay ? ` Try again in about ${retryDelay}.` : "";

      throw new Error(
        `Gemini quota exceeded for ${MODEL}.${retryHint} If this keeps happening, enable billing, wait for quota reset, or use an API key from a different Google Cloud project.`
      );
    }

    throw error;
  }
}
