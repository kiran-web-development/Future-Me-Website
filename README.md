# FutureMe 🧪

**FutureMe** is an AI-powered personal reflection web application that establishes an immersive dialogue between the user and their successful future self. Designed with an elegant, premium, Apple-inspired interface, it leverages cutting-edge AI to provide actionable insights and personalized guidance.

## Core Features

1. **Entrance Portal**: Elegantly designed display of the coordinates launchpad.
2. **Space Calibration Input**: Gathers Name, Current Age, Primary Goal/Mission, Daily Struggle/Friction Point, and One-Year Vision along with custom voice resonance channels (Motivational, Brutally Honest, Zen, etc.).
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

## Screenshots & Demo

### 1. Landing Page - Entrance Portal
<img width="1908" height="897" alt="FutureMe Landing Page - Hero Section with elegant introduction" src="https://github.com/user-attachments/assets/d22b7c35-03af-4597-8b50-74606bd4d45c" />

### 2. Space Calibration Input Form
<img width="1794" height="1087" alt="FutureMe Profile Generation Form - Input your personal details and vision" src="https://github.com/user-attachments/assets/4046afbb-b8c6-4ac3-85f8-11661205f523" />

### 3. The Quantum Console
<img width="1794" height="889" alt="FutureMe Quantum Console - Personalized action plans and mantras from your future self" src="https://github.com/user-attachments/assets/2311eaac-d8e6-41f2-9f70-22469d30eced" />

### 4. Contextual Chrono-Chat
<img width="1794" height="1141" alt="FutureMe Chat Interface - Deep dialogue with your future self to refine your path" src="https://github.com/user-attachments/assets/9902f908-e47f-4e7b-b2a9-8554d681c381" />

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
