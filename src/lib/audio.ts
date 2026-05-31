/**
 * Premium Web Audio API Synthesizer for Kiran Founder Lab's FutureMe
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Sleek minimal click sound for standard buttons
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Short wooden/high-end tick
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (err) {
    console.warn("Audio Context blocked or not supported:", err);
  }
}

// 2. Inspiring, ascending chime for the primary generation timeline start
export function playTimelineChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseTime = ctx.currentTime;
    
    // Play an elegant ascending triad sequence: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, baseTime + idx * 0.08);

      gainNode.gain.setValueAtTime(0, baseTime + idx * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.05, baseTime + idx * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, baseTime + idx * 0.08 + 0.25);

      osc.start(baseTime + idx * 0.08);
      osc.stop(baseTime + idx * 0.08 + 0.3);
    });
  } catch (err) {
    console.warn("Audio Context blocked or not supported:", err);
  }
}

// 3. Short high-pitched signal when a user pushes a chat message
export function playChatSendSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.warn("Audio Context blocked or not supported:", err);
  }
}

// 4. Elegant dual tone cascade when FutureMe responds in chat
export function playChatReceiveSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const baseTime = ctx.currentTime;
    const notes = [900, 750]; // Elegant falling mentor note

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, baseTime + idx * 0.1);

      gainNode.gain.setValueAtTime(0, baseTime + idx * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.04, baseTime + idx * 0.1 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, baseTime + idx * 0.1 + 0.28);

      osc.start(baseTime + idx * 0.1);
      osc.stop(baseTime + idx * 0.1 + 0.3);
    });
  } catch (err) {
    console.warn("Audio for chat receive not executed:", err);
  }
}
