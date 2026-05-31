import { motion } from "motion/react";
import { playClickSound } from "../lib/audio";

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const handleStart = () => {
    playClickSound();
    onStart();
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
      {/* Brand Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase rounded-full border border-white/8 bg-white/[0.02]">
          🧪 Kiran Founder Lab's
        </span>
      </motion.div>

      {/* Main Title Hero */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white mb-6"
      >
        Meet Your <br />
        <span className="text-zinc-400">Future Successful Self</span>
      </motion.h1>

      {/* Hero Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed mb-12 font-light"
      >
        Establish a direct communication channel across time. Put down your coordinates, overcome your current struggle, and model your successful timeline.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          onClick={handleStart}
          className="group relative px-8 py-4 text-base font-medium rounded-full bg-white text-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-white/5"
        >
          Start Generator ✨
        </button>
      </motion.div>

      {/* Glassy spec footer accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-20 flex flex-wrap gap-8 justify-center text-xs font-mono text-zinc-500"
      >
        <div className="flex items-center gap-1.5">
          <span>🎯 Real-Time Alignment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>⚡ Quantum Feed (Gemini 3.5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🔒 100% Encrypted & Local</span>
        </div>
      </motion.div>
    </div>
  );
}
