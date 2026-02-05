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
| `/health` | GET | Standalone health check |

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
