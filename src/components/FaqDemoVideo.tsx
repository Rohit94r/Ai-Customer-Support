"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export default function FaqDemoVideo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  mutedRef.current = muted;

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const tryPlay = () => {
      video.muted = mutedRef.current;
      return video.play().then(() => {
        setIsPlaying(true);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          tryPlay().catch(() => {
            video.muted = true;
            mutedRef.current = true;
            setMuted(true);
            tryPlay().catch(() => {});
          });
        }
      },
      { threshold: 0.3, rootMargin: "0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !muted;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    video.muted = nextMuted;
  };

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="mt-14 w-full max-w-6xl mx-auto"
    >
      <p className="text-center text-sm text-zinc-500 mb-5">
        See ApnaAI handle real FAQ-style questions — use the mute button if you do not want sound.
      </p>

      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-900 w-full aspect-video min-h-[220px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[500px]">
        <video
          ref={videoRef}
          className="w-full h-full object-contain bg-black"
          src="/demo.mp4"
          loop
          playsInline
          preload="auto"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-label="ApnaAI product demo video"
          onPlay={() => setIsPlaying(true)}
        />

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 z-10 w-11 h-11 rounded-full bg-black/75 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black transition border border-white/15 shadow-lg"
        >
          {muted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0a9 9 0 01-6.219-2.488M12 18a9 9 0 006.219-2.488M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </button>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 pointer-events-none">
            <span className="text-white/90 text-sm font-medium">Loading demo…</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
