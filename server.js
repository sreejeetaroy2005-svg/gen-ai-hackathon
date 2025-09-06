import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend from /public folder
app.use(express.static("public"));

// Setup Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
app.get("/health", (req, res) => res.send("ok"));

// Generate artisan product content (multilingual)
app.post("/api/generate", async (req, res) => {
  try {
    const { title, craft, materials, region, notes, language } = req.body;

    const prompt = `
You are an AI assistant helping Indian artisans sell their crafts online.

IMPORTANT: Write ALL output strictly in ${language}.
Do not mix English if ${language} is not English.

Languages supported: English, Hindi, Bengali, Tamil, Telugu, Marathi.

Generate:

1) Product Title (<= 60 chars)
2) Short Description (1–2 sentences)
3) Long Description (storytelling, 3–5 paragraphs)
4) 5 Marketing Hashtags
5) Suggested Price Range in INR

Details:
Title: ${title}
Craft: ${craft}
Materials: ${materials}
Region: ${region}
Notes: ${notes}
`;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    if (!result.response) {
      return res.status(500).json({ error: "No response from Gemini" });
    }

    res.json({ output: result.response.text() });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: String(err.message || err) });
  }
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`✅ Server running at http://localhost:${port}`)
);
