export type FutureMeTone = "Motivational" | "Brutally Honest" | "Calm Mentor" | "CEO Mode";

export interface ProfileData {
  name: string;
  age: string;
  goal: string;
  struggle: string;
  oneYearVision: string;
  tone: FutureMeTone;
}

export interface FutureMeProfile {
  message: string;
  futureIdentity: string;
  nextMoves: string[];
  habit: string;
  warning: string;
  mantra: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "futureme";
  message: string;
  timestamp: Date;
}

export type ScreenState = "LANDING" | "FORM" | "GENERATING" | "DASHBOARD";
