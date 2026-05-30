import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { buildLogicPrompt } from "./logicPrompt.js";

//console.log("Gemini key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cleanJson(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function analyzeLogic(userText) {
  const prompt = buildLogicPrompt(userText);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const cleaned = cleanJson(response.text);

  return JSON.parse(cleaned);
}