import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeLogic } from "./geminiService.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / was called");
  res.send("Backend is working");
});

app.get("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No argument text provided" });
    }

    //const text = "Taxes increased last year and unemployment also increased. Therefore, higher taxes caused unemployment.";
    const analysis = await analyzeLogic(text);

    res.json(analysis);
  } catch (error) {
    console.log("API key loaded:", !!process.env.GEMINI_API_KEY);
    console.error(error);
    res.status(500).json({ error: "Failed to analyze argument" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});