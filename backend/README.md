# ChuraTutor Backend

Firebase Cloud Functions backend for ChuraTutor application.

## Prerequisites

- Node.js 20+
- [Firebase CLI](https://firebase.google.com/docs/cli)

## Setup

```bash
cd backend

# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Install function dependencies
cd functions
npm install
```

## Environment Variables

Set the following environment variables for Gemini AI:

### Local Development

Create a `.env` file or set environment variables before running emulators:

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

Or use Firebase Functions config for local emulation:
```bash
cd functions
echo "GEMINI_API_KEY=your-gemini-api-key" > .env
```

### Production (Firebase)

Set the environment variable using Firebase CLI:

```bash
firebase functions:secrets:set GEMINI_API_KEY
```

Get your Gemini API key from: https://makersuite.google.com/app/apikey

## Local Development

```bash
cd backend

# Build TypeScript
cd functions && npm run build

# Start emulators
cd .. && firebase emulators:start

# Or use serve command (build + emulators)
cd functions && npm run serve
```

Emulator UI will be available at http://localhost:4000

API endpoints:
- http://localhost:5001/churatutor/us-central1/api
- http://localhost:5001/churatutor/us-central1/health

## Project Structure

```
backend/
├── firebase.json       # Firebase configuration
├── .firebaserc         # Firebase project settings
└── functions/          # Cloud Functions
    ├── src/
    │   └── index.ts    # Function definitions
    ├── package.json
    └── tsconfig.json
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/` | GET | Welcome message |
| `/api/health` | GET | Health check |
| `/api/generate` | POST | Generate text using Gemini AI |
| `/health` | GET | Standalone health check |

### POST /api/generate

Generate text using Google Gemini AI.

**Request:**
```json
{
  "prompt": "Your question or prompt text"
}
```

**Response:**
```json
{
  "response": "Generated text from Gemini AI"
}
```

**Example:**
```bash
curl -X POST http://localhost:5001/churatutor/us-central1/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the capital of Japan?"}'
```

## Deploy

```bash
cd backend

# Deploy functions only
firebase deploy --only functions

# Deploy all (functions + hosting)
firebase deploy
```

## Development

```bash
cd functions

# Type check and build
npm run build

# Watch mode
npm run build:watch

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Firebase Console

Access your project at: https://console.firebase.google.com/project/churatutor
