import React, { useState } from "react";
import { motion } from "motion/react";
import { ProfileData, FutureMeTone } from "../types";
import { playClickSound, playTimelineChime } from "../lib/audio";

interface ReflectionFormProps {
  onSubmit: (data: ProfileData) => void;
  onBack: () => void;
}

const TONE_INFO: { tone: FutureMeTone; description: string; emoji: string }[] = [
  {
    tone: "Motivational",
    emoji: "✨",
    description: "Warm, inspiring, supportive, and grounded in realistic self-belief.",
  },
  {
    tone: "Brutally Honest",
    emoji: "🔥",
    description: "Direct, sharp, no excuses. Delivers the raw truth about your current habits.",
  },
  {
    tone: "Calm Mentor",
    emoji: "🧘",
    description: "Peaceful, wise, grounded, and focused on steady interior and exterior growth.",
  },
  {
    tone: "CEO Mode",
    emoji: "📈",
    description: "Strategic, execution-heavy, treating your life metrics like a high-growth startup.",
  },
];

export default function ReflectionForm({ onSubmit, onBack }: ReflectionFormProps) {
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    age: "",
    goal: "",
    struggle: "",
    oneYearVision: "",
    tone: "Calm Mentor",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof ProfileData, string>> = {};
    if (!formData.name.trim()) tempErrors.name = "Your name is required to establish alignment.";
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      tempErrors.age = "Please provide a valid current age.";
    }
    if (!formData.goal.trim()) tempErrors.goal = "A clear high-level goal is necessary.";
    if (!formData.struggle.trim()) tempErrors.struggle = "Identifying your struggle is crucial.";
    if (!formData.oneYearVision.trim()) tempErrors.oneYearVision = "Your vision helps calculate the final coordinates.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ProfileData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToneSelect = (tone: FutureMeTone) => {
    playClickSound();
    setFormData((prev) => ({ ...prev, tone }));
  };

  const handleBackWithSound = () => {
    playClickSound();
    onBack();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      playTimelineChime();
      onSubmit(formData);
    } else {
      playClickSound();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <button
          onClick={handleBackWithSound}
          className="text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>← Back to Entrance</span>
        </button>
      </div>

      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
          Enter Your Current Coordinates
        </h2>
        <p className="text-sm text-zinc-400 font-light mt-1">
          Specify your current reality so your successful future self can target this exact intersection.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name and Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Kiran"
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1.5 font-light">⚠️ {errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
              Current Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 23"
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
              maxLength={3}
            />
            {errors.age && (
              <p className="text-xs text-red-400 mt-1.5 font-light">⚠️ {errors.age}</p>
            )}
          </div>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
            Primary Goal / Life Mission
          </label>
          <input
            type="text"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="e.g. Launch a high-growth SaaS business that hits $100k MRR"
            className="w-full glass-input px-4 py-3 rounded-xl text-sm"
          />
          {errors.goal && (
            <p className="text-xs text-red-400 mt-1.5 font-light">⚠️ {errors.goal}</p>
          )}
        </div>

        {/* Current Struggle */}
        <div>
          <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
            Current Primary Struggle / Friction Point
          </label>
          <textarea
            name="struggle"
            value={formData.struggle}
            onChange={handleChange}
            placeholder="e.g. Spending too much time researching instead of coding & shipping weekly."
            rows={3}
            className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
          />
          {errors.struggle && (
            <p className="text-xs text-red-400 mt-1.5 font-light">⚠️ {errors.struggle}</p>
          )}
        </div>

        {/* One-Year Vision */}
        <div>
          <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">
            Your Absolute Vision for 12 Months From Now
          </label>
          <textarea
            name="oneYearVision"
            value={formData.oneYearVision}
            onChange={handleChange}
            placeholder="e.g. Having a shipped product, a committed customer base, and a rigorous daily workflow."
            rows={3}
            className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
          />
          {errors.oneYearVision && (
            <p className="text-xs text-red-400 mt-1.5 font-light">⚠️ {errors.oneYearVision}</p>
          )}
        </div>

        {/* FutureMe Tone Selector */}
        <div>
          <label className="block text-xs font-mono tracking-wider text-zinc-400 uppercase mb-4">
            FutureMe Resonance Tone
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TONE_INFO.map((item) => (
              <div
                key={item.tone}
                onClick={() => handleToneSelect(item.tone)}
                className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all flex items-start gap-4 ${
                  formData.tone === item.tone
                    ? "border-white bg-white/[0.05] ring-2 ring-white/10"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="text-2xl mt-0.5">{item.emoji}</div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.tone}</h4>
                  <p className="text-xs text-zinc-400 font-light mt-1 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 text-sm font-medium rounded-xl bg-white text-black hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer font-sans shadow-lg shadow-white/5"
          >
            Generate My FutureMe Profile ✨
          </button>
        </div>
      </form>
    </motion.div>
  );
}
