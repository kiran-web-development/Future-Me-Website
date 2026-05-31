import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, ProfileData } from "../types";
import { playChatSendSound, playChatReceiveSound } from "../lib/audio";

interface FutureMeChatProps {
  coordinates: ProfileData;
}

export default function FutureMeChat({ coordinates }: FutureMeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add an initial greeting from FutureMe
    setMessages([
      {
        id: "initial-greet",
        role: "futureme",
        message: `Hello ${coordinates.name}. I am speaking to you from a year into the future. Ask me anything about how we crossed this chasm or how we handled the challenges ahead.`,
        timestamp: new Date(),
      }
    ]);
    // Optional tiny delay to let user hear the initial contact ping
    setTimeout(() => {
      playChatReceiveSound();
    }, 450);
  }, [coordinates]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    setErrorText(null);
    const userMsgText = inputValue.trim();
    setInputValue("");

    playChatSendSound();

    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      message: userMsgText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat-futureme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: coordinates,
          chatHistory: messages.map((m) => ({
            role: m.role,
            message: m.message,
          })),
          question: userMsgText,
        }),
      });

      const result = await response.json();

      if (result.success) {
        playChatReceiveSound();
        const replyMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "futureme",
          message: result.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, replyMsg]);
      } else {
        throw new Error(result.error || "The link to your timeline became unstable.");
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorText("FutureMe could not respond right now. Try again.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Info */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white tracking-tight flex items-center gap-2 text-sm sm:text-base">
            <span>💬</span> Follow-up Chat
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            Context: {coordinates.name} ({coordinates.tone} Mode)
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-[300px] max-h-[600px] sm:max-h-[none]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                  msg.role === "user"
                    ? "bg-white/10 text-white border-white/10 rounded-tr-none"
                    : "bg-white/5 text-zinc-300 border-white/5 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.message}</p>
                <span className="block text-[8px] text-zinc-500 text-right mt-1 font-mono">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 text-zinc-400 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none text-xs sm:text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}

          {errorText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="bg-red-500/10 text-red-300 border border-red-500/25 px-4 py-2 rounded-xl text-xs text-center font-sans">
                ⚠️ {errorText}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-2xl p-1 flex items-center gap-2 border border-white/10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask your future self..."
            className="bg-transparent flex-1 px-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-zinc-650 text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-black cursor-pointer hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white transition-colors shrink-0"
          >
            <span>🔄</span>
          </button>
        </div>
      </form>
    </div>
  );
}
