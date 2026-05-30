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

app.post("/analyze", (req, res) => {
  console.log("POST /analyze was called");
  res.json({
    message: "Analyze route is working",
    receivedText: req.body.text
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});