import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {GoogleGenerativeAI} from "@google/generative-ai";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Handle /api/generate endpoint
 */
async function handleGenerate(
  request: functions.https.Request,
  response: functions.Response
): Promise<void> {
  // Only allow POST method
  if (request.method !== "POST") {
    response.status(405).json({error: "Method not allowed. Use POST."});
    return;
  }

  // Validate request body
  const {prompt} = request.body;
  if (!prompt || typeof prompt !== "string") {
    response.status(400).json({error: "Missing or invalid 'prompt' in request body"});
    return;
  }

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    response.status(500).json({error: "GEMINI_API_KEY is not configured"});
    return;
  }

  try {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    response.json({response: text});
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    response.status(500).json({error: `Failed to generate content: ${errorMessage}`});
  }
}

/**
 * Root endpoint - Welcome message
 */
export const api = functions.https.onRequest((request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  const path = request.path.replace(/^\/api/, "");

  switch (path) {
  case "/":
  case "":
    response.json({message: "Welcome to ChuraTutor API"});
    break;
  case "/health":
    response.json({status: "healthy"});
    break;
  case "/generate":
    handleGenerate(request, response);
    break;
  default:
    response.status(404).json({error: "Not found"});
  }
});

/**
 * Health check endpoint (standalone function)
 */
export const health = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.json({status: "healthy"});
});
