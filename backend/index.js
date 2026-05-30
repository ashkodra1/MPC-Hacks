import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / was called");
  res.send("Backend is working");
});

app.post("/analyze", async (req, res) => {
    try {
      const { text } = req.body;
  
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: "No argument text provided" });
      }
  
      const prompt = buildLogicPrompt(text);
  
      // call Gemini/OpenAI here
      const analysis = await analyzeWithAI(prompt);
  
      res.json(analysis);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze argument" });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});