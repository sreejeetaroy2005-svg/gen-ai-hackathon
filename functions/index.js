import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs"; // eslint-disable-line no-unused-vars
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // eslint-disable-line no-unused-vars


const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "/tmp" });

//const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/health", (req, res) => res.send("✅ Server is running"));

app.post("/api/generate", upload.single("image"), async (req, res) => {
  // paste your /api/generate logic here
  res.json({ message: "Example response" });
});

// Export Express app as Firebase Function
export const api = functions.https.onRequest(app);
