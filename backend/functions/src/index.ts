import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

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
