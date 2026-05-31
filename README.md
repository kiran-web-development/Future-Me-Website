# FutureMe 🧪

**FutureMe** is an AI-powered personal reflection web application that establishes an immersive dialogue between the user and their successful future self. Designed with an elegant, premium, Apple-inspired dark aesthetic featuring deep blacks, crisp typography, and subtle glassmorphic panels, it completely rejects distracting linear/radial color gradients in favor of an elite, focused workspace.

## Core Features

1. **Entrance Portal**: Elegantly designed display of the coordinates launchpad.
2. **Space Calibration Input**: Gathers Name, Current Age, Primary Goal/Mission, Daily Struggle/Friction Point, and One-Year Vision along with custom voice resonance channels (Motivational, Brutally Honest, Calm Mentor, CEO Mode).
3. **Synchronous Forging Sequence**: A cinematic multi-step transition showing precise calibration parameters as they compile.
4. **The Quantum Console**: Displays custom Identity signposts, actionable immediate strategic maneuvers, warning beacons, personalized daily mantras, and keystone habits.
5. **Contextual Chrono-Chat**: Full interactive follow-up capability preserving original coordinates, selected tone constraints, and history to deep dive into action plans.

---

## Installation & Running Local Development

To run this application locally, follow these steps:

### 1. Configure the Secrets & Keys
Create a `.env` file in the root workspace directory with your Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 2. Install Packages
Build environments rely on standard node.js:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Wait for the terminal message to output and point your web browser directly to `http://localhost:3000`.

---

## API Routes Documentation

The full-stack architecture encapsulates the Google Gen AI SDK securely server-side so keys are never leaked to browser agents. 

### 1. **POST** `/api/generate-futureme`
- **Description**: Synthesizes the initial future timeline and profile context. 
- **Payload Schema**:
  ```json
  {
    "name": "Kiran",
    "age": "23",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```
- **Response Format**: Returns a parsed JSON profile matching `FutureMeProfile` properties.

### 2. **POST** `/api/chat-futureme`
- **Description**: Handles context-aware multi-turn interactive dialogue with the persona.
- **Payload Schema**:
  ```json
  {
    "userProfile": { ...profileCoordinates },
    "chatHistory": [
      { "role": "user", "message": "Will I make it?" },
      { "role": "futureme", "message": "Only if you act now." }
    ],
    "question": "What should I focus on this week?"
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "reply": "Your immediate battle is with the low-impact study habits..."
  }
  ```
