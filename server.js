import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Multer: store uploads in /uploads
const upload = multer({ dest: "uploads/" });

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
app.get("/health", (req, res) => res.send("✅ Server is running"));

// Main API route
app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    const { title, craft, materials, region, notes, language } = req.body;

    // Prepare image if uploaded
    let imagePart = null;
    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString("base64");
      imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      };
    }

    // Build dynamic prompt
    let prompt = `
You are an AI assistant helping Indian artisans sell their crafts online.

IMPORTANT: Write ALL output strictly in ${language}.
Do not mix English if ${language} is not English.

Generate:
1) Product Title (<= 60 chars)
2) Short Description (1–2 sentences)
3) Long Description (storytelling, 3–5 paragraphs)
4) 5 Marketing Hashtags
5) Suggested Price Range in INR
`;

    if (title || craft || materials || region || notes) {
      prompt += `
Details from user:
Title: ${title || "N/A"}
Craft: ${craft || "N/A"}
Materials: ${materials || "N/A"}
Region: ${region || "N/A"}
Notes: ${notes || "N/A"}
`;
    } else if (imagePart) {
      prompt += `
No text details were provided. Please analyze the uploaded image and generate content.
`;
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      prompt,
      ...(imagePart ? [imagePart] : []),
    ]);

    // Clean up uploaded image (optional)
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("⚠️ Error deleting temp file:", err);
      });
    }

    res.json({ output: result.response.text() });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: String(err.message || err) });
  }
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`✅ Server running at http://localhost:${port}`)
);
