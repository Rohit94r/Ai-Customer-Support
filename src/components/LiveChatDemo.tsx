"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type DemoMessage = { role: "user" | "bot"; text: string };

const CONVERSATIONS: DemoMessage[][] = [
  [
    { role: "user", text: "Do you offer cash on delivery?" },
    { role: "bot", text: "Yes! Cash on Delivery is available for all orders above ₹500." },
    { role: "user", text: "How long does delivery take?" },
    { role: "bot", text: "Metro cities: 2–3 days. Other areas: 4–6 business days." },
  ],
  [
    { role: "user", text: "What is your return policy?" },
    { role: "bot", text: "You can return products within 7 days if unused and in original packaging." },
    { role: "user", text: "Do you have UPI payment?" },
    { role: "bot", text: "Yes — Google Pay, PhonePe, Paytm, and all major UPI apps are accepted." },
  ],
];

const TIMING = {
  /** ms before the demo starts */
  initialPause: 1400,
  /** per-character delay while the customer types */
  userCharMs: 52,
  /** pause after a full user message */
  afterUserMessage: 2200,
  /** how long the “…” typing indicator shows before bot text */
  botTypingIndicatorMs: 2200,
  /** per-character delay while the bot types */
  botCharMs: 62,
  /** pause after a full bot message */
  afterBotMessage: 3200,
  /** pause before switching to the next conversation loop */
  beforeNextConversation: 5000,
};

function TypingIndicator() {
  return (
    <div className="bg-zinc-100 rounded-xl px-4 py-3 text-sm w-fit flex items-center gap-1.5">
      <span className="sr-only">Assistant is typing</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-zinc-400"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
      className="inline-block w-0.5 h-4 bg-zinc-500 ml-0.5 align-middle"
    />
  );
}

type Phase = "idle" | "typing-user" | "bot-indicator" | "typing-bot";

export default function LiveChatDemo({ onOpenChat }: { onOpenChat?: () => void }) {
  const [conversationIndex, setConversationIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<DemoMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [draftText, setDraftText] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = CONVERSATIONS[conversationIndex];
  const current = messages[messageIndex];

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const schedule = (fn: () => void, ms: number) => {
    clearTimer();
    timeoutRef.current = setTimeout(fn, ms);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  useEffect(() => {
    clearTimer();

    if (!current) {
      schedule(() => {
        setCompletedMessages([]);
        setMessageIndex(0);
        setDraftText("");
        setPhase("idle");
        setConversationIndex((i) => (i + 1) % CONVERSATIONS.length);
      }, TIMING.beforeNextConversation);
      return;
    }

    if (phase === "idle") {
      setDraftText("");
      const prevRole =
        messageIndex > 0 ? messages[messageIndex - 1]?.role : completedMessages.at(-1)?.role;
      const pause =
        messageIndex === 0 && completedMessages.length === 0
          ? TIMING.initialPause
          : prevRole === "user"
            ? TIMING.afterUserMessage
            : TIMING.afterBotMessage;

      schedule(() => {
        setPhase(current.role === "user" ? "typing-user" : "bot-indicator");
      }, pause);
      return;
    }

    if (phase === "typing-user") {
      const full = current.text;
      if (draftText.length < full.length) {
        schedule(() => {
          setDraftText(full.slice(0, draftText.length + 1));
        }, TIMING.userCharMs);
        return;
      }
      setCompletedMessages((prev) => [...prev, current]);
      setDraftText("");
      setMessageIndex((i) => i + 1);
      setPhase("idle");
      return;
    }

    if (phase === "bot-indicator") {
      schedule(() => {
        setPhase("typing-bot");
        setDraftText("");
      }, TIMING.botTypingIndicatorMs);
      return;
    }

    if (phase === "typing-bot") {
      const full = current.text;
      if (draftText.length < full.length) {
        schedule(() => {
          setDraftText(full.slice(0, draftText.length + 1));
        }, TIMING.botCharMs);
        return;
      }
      setCompletedMessages((prev) => [...prev, current]);
      setDraftText("");
      setMessageIndex((i) => i + 1);
      setPhase("idle");
      return;
    }
  }, [phase, draftText, current, messageIndex, conversationIndex, completedMessages.length, messages]);

  useEffect(() => {
    setCompletedMessages([]);
    setMessageIndex(0);
    setDraftText("");
    setPhase("idle");
  }, [conversationIndex]);

  const isUserDraft = phase === "typing-user" && draftText.length > 0;
  const isBotDraft = phase === "typing-bot" && draftText.length > 0;
  const showBotIndicator = phase === "bot-indicator";

  return (
    <div className="relative">
      <div className="rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-linear-to-br from-zinc-900 to-black text-white px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Apna AI Support</div>
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online · replies instantly
            </div>
          </div>
          <span className="text-xs text-zinc-500">Live demo</span>
        </div>

        <div className="p-5 min-h-[260px] space-y-3 bg-zinc-50/50">
          <AnimatePresence mode="popLayout">
            {completedMessages.map((msg, i) => (
              <motion.div
                key={`${conversationIndex}-done-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={
                  msg.role === "user"
                    ? "bg-black text-white rounded-xl px-4 py-2.5 text-sm ml-auto w-fit max-w-[85%] shadow-sm"
                    : "bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm w-fit max-w-[90%] text-zinc-800 shadow-sm"
                }
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {isUserDraft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black text-white rounded-xl px-4 py-2.5 text-sm ml-auto w-fit max-w-[85%] shadow-sm"
            >
              {draftText}
              <BlinkingCursor />
            </motion.div>
          )}

          {showBotIndicator && <TypingIndicator />}

          {isBotDraft && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm w-fit max-w-[90%] text-zinc-800 shadow-sm"
            >
              {draftText}
              <BlinkingCursor />
            </motion.div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-200 bg-white flex gap-2 items-center">
          <div className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-xs text-zinc-400">
            Type your question...
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm">
            ↑
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        aria-label="Open live chat"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -bottom-6 -right-6 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition text-xl"
        onClick={onOpenChat}
      >
        💬
      </motion.button>
    </div>
  );
}
