import React, { useState } from "react";
import { motion } from "motion/react";
import { FutureMeProfile, ProfileData } from "../types";
import FutureMeChat from "./FutureMeChat";
import { playClickSound } from "../lib/audio";

interface ResultsDashboardProps {
  profile: FutureMeProfile;
  coordinates: ProfileData;
  onRegenerate: () => void;
}

export default function ResultsDashboard({
  profile,
  coordinates,
  onRegenerate,
}: ResultsDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  React.useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    const fullText = profile.message;
    // Deliver the full text within roughly ~80 frames for a rapid, premium, high-tech decryption feel
    const step = Math.max(1, Math.ceil(fullText.length / 80));
    const interval = setInterval(() => {
      index += step;
      if (index >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.slice(0, index));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [profile.message]);

  const handleCopy = async () => {
    playClickSound();
    const textToCopy = `=== FUTUREME TIMELINE COORDINATES ===
Name: ${coordinates.name}
Tone: ${coordinates.tone}
One-Year Vision: ${coordinates.oneYearVision}

=== FUTURE IDENTITY ===
${profile.futureIdentity}

=== THE MESSAGE FROM YOUR FUTURE SELF ===
"${profile.message}"

=== IMMEDIATE NEXT MOVES ===
${profile.nextMoves.map((m, i) => `${i + 1}. ${m}`).join("\n")}

=== DAILY HABIT TO BUILD ===
${profile.habit}

=== CRUCIAL WARNING ===
${profile.warning}

=== DAILY MANTRA ===
"${profile.mantra}"

Generated via FutureMe / Kiran Founder Lab's`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleResetWithSound = () => {
    playClickSound();
    onRegenerate();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-7xl mx-auto px-4 py-6"
    >
      {/* Split layout: Content on Left, Chat on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left main area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Header Bar */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight text-white font-sans">FutureMe</span>
              <span className="px-2 py-0.5 rounded border border-white/20 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-white/[0.02]">
                v2.0
              </span>
            </div>
            <div className="flex gap-6">
              <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-white">
                ✨ Status: Optimal Timeline
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-500">
                Sync: Active
              </span>
            </div>
          </header>

          {/* Main profile card panel (Glass container) */}
          <div className="flex-1 glass-panel p-6 sm:p-8 rounded-[24px] flex flex-col justify-between overflow-hidden relative min-h-[450px]">
            {/* Year Watermark */}
            <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-[120px] sm:text-[180px] font-black pointer-events-none select-none text-white leading-none">
              2027
            </div>

            {/* Title / Identity */}
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-400 block">
                👑 Realized Future Identity
              </span>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white mt-1 leading-tight sm:max-w-xl">
                {profile.futureIdentity}
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm font-light">
                Aligned with {coordinates.name} • {coordinates.age} Coordination Center • {coordinates.tone} Mode
              </p>
            </div>

            {/* Letter block (Glass Card) */}
            <div className="glass-panel hover:border-white/12 p-6 rounded-2xl relative z-10 bg-white/[0.01] my-6 transition-all duration-300">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-400">
                  💬 Message from Year One
                </span>
                {isTyping && (
                  <span className="text-[9px] font-mono tracking-wider text-green-400 bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded animate-pulse">
                    ⚡ Formulating transmission...
                  </span>
                )}
              </div>
              <p className="text-zinc-200 leading-relaxed text-sm sm:text-base font-light italic whitespace-pre-wrap min-h-[120px]">
                "{displayedText}"
                {isTyping && (
                  <span className="inline-block w-1.5 h-4 bg-white/80 ml-1 animate-pulse" />
                )}
              </p>
            </div>

            {/* Two Column Grid: Mantra & Crucial Warning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* Mantra Card */}
              <div className="glass-panel p-5 rounded-2xl bg-white/[0.01]">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-400">
                  🎯 Daily Mantra
                </span>
                <p className="text-lg font-medium tracking-tight text-white mt-2 italic">
                  "{profile.mantra}"
                </p>
              </div>

              {/* Warning Card */}
              <div className="glass-panel p-5 rounded-2xl border-red-500/10 bg-red-500/[0.01]">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-red-400">
                  ⚠️ Crucial Warning
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed font-light">
                  {profile.warning}
                </p>
              </div>
            </div>
          </div>

          {/* Next Moves row and Daily Habit side box */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Next moves (Glass box) */}
            <div className="flex-1 glass-panel p-6 rounded-[24px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-400 block mb-4">
                  🚀 Immediate Tactical Next Moves
                </span>
                <ul className="space-y-3">
                  {profile.nextMoves.map((move, index) => (
                    <li key={index} className="flex items-start gap-3.5 text-sm text-zinc-300 line-clamp-2">
                      <span className="text-white font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-xs border border-white/5 select-none mt-0.5">
                        0{index + 1}
                      </span>
                      <span className="font-light leading-relaxed">{move}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Habit box and copy button combo */}
            <div className="w-full md:w-80 glass-panel p-6 rounded-[24px] flex flex-col justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-zinc-400 block">
                  💡 Daily Keystone Habit
                </span>
                <p className="text-sm leading-relaxed text-zinc-300 font-light">
                  {profile.habit}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 bg-white text-black font-semibold rounded-xl text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors active:scale-95 duration-200 cursor-pointer text-center"
                >
                  {copied ? "✅ Copied" : "📋 Copy Results"}
                </button>
                <button
                  onClick={handleResetWithSound}
                  className="py-3 px-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95 duration-200 cursor-pointer text-center"
                  title="Configure new coordinates"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right chatbot area (integrated sidebar) */}
        <aside className="w-full lg:w-96 glass-panel rounded-[24px] overflow-hidden flex flex-col self-stretch">
          <FutureMeChat coordinates={coordinates} />
        </aside>

      </div>
    </motion.div>
  );
}
