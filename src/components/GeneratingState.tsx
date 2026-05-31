import { useEffect, useState } from "react";
import { motion } from "motion/react";

const STEPS = [
  "Calibrating neural path parameters...",
  "Analyzing your current coordinates...",
  "Bridging the one-year vision quantum state...",
  "Isolating your current core struggles...",
  "Synthesizing optimal strategic next moves...",
  "Forging your alternative successful timeline...",
  "Downloading message from FutureMe..."
];

export default function GeneratingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto">
      {/* Animated glowing portal or node */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        {/* Outer glowing border */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-zinc-850 border border-white/20"
        />
        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-white/10 border border-white flex items-center justify-center"
        >
          <span className="text-sm">⏳</span>
        </motion.div>
      </div>

      {/* Main message */}
      <h3 className="text-xl sm:text-2xl font-sans font-bold text-white mb-2">
        Forging Timeline Connection
      </h3>
      
      {/* Dynamic changing state steps */}
      <div className="h-6">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm font-mono text-zinc-400 tracking-wide"
        >
          {STEPS[currentStep]}
        </motion.p>
      </div>

      {/* Static premium subtitles */}
      <p className="text-xs text-zinc-600 font-mono mt-12 uppercase tracking-[0.2em]">
        Quantum secure bridge active
      </p>
    </div>
  );
}
