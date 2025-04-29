"use client";

import { SnackGallery } from "@/components/snack-gallery";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function Home() {
  const [stage, setStage] = useState<"intro" | "video" | "gallery">("intro");
  const [muted, setMuted] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleEnterClick = () => {
    setStage("video");

    // Use setInterval to check video timestamp
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= 3.8) {
          // Automatically go to gallery after 4 seconds
          setStage("gallery");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    }, 100); // Check every 100ms
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <main className="relative min-h-screen w-full bg-[#f3eadf] overflow-hidden">
      {/* Grainy overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-soft-light pointer-events-none"></div>

      {/* Glass bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 3 === 0
                  ? "rgba(231, 101, 38, 0.1)"
                  : i % 3 === 1
                  ? "rgba(71, 128, 186, 0.1)"
                  : "rgba(233, 123, 160, 0.1)",
              backdropFilter: "blur(8px)",
              border:
                i % 3 === 0
                  ? "1px solid rgba(231, 101, 38, 0.2)"
                  : i % 3 === 1
                  ? "1px solid rgba(71, 128, 186, 0.2)"
                  : "1px solid rgba(233, 123, 160, 0.2)",
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div
              key="intro"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-48 h-48 sm:w-64 sm:h-64 mb-8 sm:mb-12"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <Image
                  src="/images/noir-coffee.png"
                  alt="zkSnack"
                  width={256}
                  height={256}
                  className="rounded-full shadow-[0_0_30px_rgba(231,101,38,0.5)] animate-pulse"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleEnterClick}
                  className="text-lg sm:text-xl px-8 py-6 bg-[#e76526] hover:bg-[#d55415] text-white rounded-full shadow-[0_0_20px_rgba(231,101,38,0.4)] border border-[#e76526]/20"
                >
                  Enter zkSnacks
                </Button>
              </motion.div>
            </motion.div>
          )}

          {stage === "video" && (
            <motion.div
              key="video"
              className="w-full h-screen flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-[min(80vh,90vw)] h-[min(80vh,90vw)] mx-auto">
                <ReactPlayer
                  ref={playerRef}
                  url="https://www.youtube.com/watch?v=qlwIPx6BZJ0"
                  width="100%"
                  height="100%"
                  playing
                  muted={muted}
                  controls={false}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        showinfo: 0,
                        rel: 0,
                        iv_load_policy: 3,
                        fs: 0,
                        preload: true,
                      },
                    },
                  }}
                  style={{
                    aspectRatio: "1/1",
                  }}
                />

                {/* Custom mute button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-4 right-4 z-20 p-2 sm:p-3 rounded-full bg-[#4780ba] text-white hover:bg-[#3a6fa3] transition-colors"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {!muted ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          {stage === "gallery" && (
            <motion.div
              key="gallery"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SnackGallery />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
