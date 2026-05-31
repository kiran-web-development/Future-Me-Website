import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingScreen from "./components/LandingScreen";
import ReflectionForm from "./components/ReflectionForm";
import GeneratingState from "./components/GeneratingState";
import ResultsDashboard from "./components/ResultsDashboard";
import { ProfileData, FutureMeProfile, ScreenState } from "./types";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("LANDING");
  const [coordinates, setCoordinates] = useState<ProfileData | null>(null);
  const [generatedProfile, setGeneratedProfile] = useState<FutureMeProfile | null>(null);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const handleStart = () => {
    setErrorHeader(null);
    setScreen("FORM");
  };

  const handleBackToLanding = () => {
    setScreen("LANDING");
  };

  const handleFormSubmit = async (data: ProfileData) => {
    setCoordinates(data);
    setScreen("GENERATING");
    setErrorHeader(null);

    try {
      const response = await fetch("/api/generate-futureme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `Server error (${response.status})`;
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.error) errorMessage = parsed.error;
        } catch {
          if (text.includes("GEMINI_API_KEY")) {
            errorMessage = "GEMINI_API_KEY is missing in Vercel settings. Please configure it under Environment Variables.";
          } else {
            errorMessage = `Vercel server returned error code ${response.status}. Please check your environment configuration.`;
          }
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();

      if (json.success && json.data) {
        setGeneratedProfile(json.data);
        setScreen("DASHBOARD");
      } else {
        throw new Error(json.error || "Establishment sequence failed.");
      }
    } catch (err: any) {
      console.error("Failed to generate FutureMe profile:", err);
      setErrorHeader(err.message || "FutureMe could not respond right now. Try again.");
      setScreen("FORM");
    }
  };

  const handleRegenerate = () => {
    // Go back to form, preserving previous coordinates
    setErrorHeader(null);
    setScreen("FORM");
  };

  return (
    <div className="min-h-screen bg-black text-white relative font-sans antialiased overflow-x-hidden flex flex-col justify-between py-6">
      
      {/* Absolute faint premium subtle glowing ambient points (solid color glows with high opacity/blur, no linear gradients as per style rules) */}
      <div className="absolute top-20 left-10 w-44 h-44 bg-white/[0.01] blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-zinc-400/[0.01] blur-[100px] pointer-events-none rounded-full" />

      {/* Header Info (Visible on entry and form screen, results has its custom rich header) */}
      {screen !== "DASHBOARD" && (
        <div className="w-full max-w-7xl mx-auto px-6 mb-4 flex justify-between items-center z-10">
          <div 
            onClick={() => setScreen("LANDING")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-xl font-bold tracking-tight text-white transition-opacity group-hover:opacity-80">
              FutureMe
            </span>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/8 select-none">
              YEAR ONE
            </span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:block">
            Kiran Founder Lab's • Quantum Bridge
          </div>
        </div>
      )}

      {/* Main Screen Router with Framer Motion AnimatePresence */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center relative z-20">
        
        {/* User-friendly Error Banner */}
        <AnimatePresence>
          {errorHeader && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 my-4 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300 text-sm font-sans flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">⚠️</span>
                <span>{errorHeader}</span>
              </div>
              <button 
                onClick={() => setErrorHeader(null)}
                className="text-xs text-red-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {screen === "LANDING" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LandingScreen onStart={handleStart} />
            </motion.div>
          )}

          {screen === "FORM" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ReflectionForm 
                onSubmit={handleFormSubmit} 
                onBack={handleBackToLanding}
              />
            </motion.div>
          )}

          {screen === "GENERATING" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GeneratingState />
            </motion.div>
          )}

          {screen === "DASHBOARD" && generatedProfile && coordinates && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDashboard
                profile={generatedProfile}
                coordinates={coordinates}
                onRegenerate={handleRegenerate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fine-print Footer */}
      {screen !== "DASHBOARD" && (
        <footer className="w-full text-center py-4 text-[10px] text-zinc-650 font-mono tracking-widest z-10">
          FUTUREME SYSTEM • ALL VIRTUAL WORLD TIMELINES SECURED • DESIGN BY KIRAN FOUNDER LABS
        </footer>
      )}
    </div>
  );
}
