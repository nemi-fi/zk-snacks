"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type Snack = {
  id: number;
  name: string;
  description: string;
  claimed: boolean;
  color: "orange" | "blue" | "pink";
  image: string;
};

const snacks: Snack[] = [
  {
    id: 1,
    name: "Private Shared Steak",
    description: "Classic, from Graz",
    claimed: false,
    color: "orange",
    image: "/images/private-shared-steak.png",
  },
  {
    id: 2,
    name: "Nullifiers in Soy Sauce",
    description: "Make the note hashes salty",
    claimed: false,
    color: "blue",
    image: "/images/nullifiers.png",
  },
  {
    id: 3,
    name: "Nemi-sis Cake",
    description: "Taste of private DeFi",
    claimed: true,
    color: "pink",
    image: "/images/nemi-sis.png",
  },
  {
    id: 4,
    name: "Noir Coffee",
    description: "Like black, but noir",
    claimed: false,
    color: "orange",
    image: "/images/noir-coffee.png",
  },
  {
    id: 5,
    name: "Baked Noirwhal",
    description: "Served on the Poseidon2 trident",
    claimed: false,
    color: "blue",
    image: "/images/narwhal.png",
  },
  {
    id: 6,
    name: "Commit-mints",
    description: "Devote to freshness",
    claimed: true,
    color: "pink",
    image: "/images/commit-mints.png",
  },
  {
    id: 7,
    name: "Hash Brownie",
    description: "Mixed sweetness",
    claimed: false,
    color: "orange",
    image: "/images/hash-brownie.png",
  },
  {
    id: 8,
    name: "A bottle of mezcal",
    description: "Can't see nothing when drunk",
    claimed: false,
    color: "blue",
    image: "/images/mezcal.png",
  },
  {
    id: 9,
    name: "Clarified Lambs",
    description: "Sheeping",
    claimed: true,
    color: "pink",
    image: "/images/clarified-lambs.png",
  },
  {
    id: 10,
    name: "Obsidion Ashes",
    description: 'Pork done "Congratulations"',
    claimed: false,
    color: "orange",
    image: "/images/obsidion-ashes.png",
  },
];

const getColorStyles = (color: "orange" | "blue" | "pink") => {
  switch (color) {
    case "orange":
      return {
        bg: "rgba(231, 101, 38, 0.1)",
        border: "rgba(231, 101, 38, 0.3)",
        shadow: "rgba(231, 101, 38, 0.3)",
        button: "bg-[#e76526] hover:bg-[#d55415]",
        disabledButton: "bg-[#e76526]/30 text-[#e76526]/60",
      };
    case "blue":
      return {
        bg: "rgba(71, 128, 186, 0.1)",
        border: "rgba(71, 128, 186, 0.3)",
        shadow: "rgba(71, 128, 186, 0.3)",
        button: "bg-[#4780ba] hover:bg-[#3a6fa3]",
        disabledButton: "bg-[#4780ba]/30 text-[#4780ba]/60",
      };
    case "pink":
      return {
        bg: "rgba(233, 123, 160, 0.1)",
        border: "rgba(233, 123, 160, 0.3)",
        shadow: "rgba(233, 123, 160, 0.3)",
        button: "bg-[#e97ba0] hover:bg-[#d66a8f]",
        disabledButton: "bg-[#e97ba0]/30 text-[#e97ba0]/60",
      };
  }
};

export function SnackGallery() {
  const [claimedSnacks, setClaimedSnacks] = useState<number[]>(
    snacks.filter((snack) => snack.claimed).map((snack) => snack.id),
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleClaim = (id: number) => {
    if (!claimedSnacks.includes(id)) {
      setClaimedSnacks([...claimedSnacks, id]);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = isMobile
        ? current.clientWidth * 0.9
        : current.clientWidth * 0.6;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full py-1">
      <div className="text-center  px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#4780ba] ">
          zkSnacks Collection
        </h1>
        <p className="text-[#333] text-base sm:text-lg max-w-2xl mx-auto">
          Claim your cryptographically delicious treats. Each zkSnack proves you
          own it without revealing your identity.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#f3eadf] p-2 sm:p-3 rounded-full text-[#4780ba] hover:bg-[#e7dfd4] transition-colors border border-[#4780ba]/20 shadow-md"
          aria-label="Scroll left"
        >
          <ChevronLeft size={isMobile ? 20 : 24} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 sm:gap-10 py-6 sm:py-10 px-6 sm:px-10 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {snacks.map((snack) => {
            const colorStyles = getColorStyles(snack.color);

            return (
              <motion.div
                key={snack.id}
                className="flex-shrink-0 snap-center"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative flex flex-col items-center">
                  {/* Plate */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                    <motion.div
                      className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full"
                      style={{
                        background: colorStyles.bg,
                        border: `1px solid ${colorStyles.border}`,
                        boxShadow: `0 10px 30px ${colorStyles.shadow}`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 10px 20px ${colorStyles.shadow}`,
                          `0 10px 30px ${colorStyles.shadow}`,
                          `0 10px 20px ${colorStyles.shadow}`,
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />

                    {/* Plate rim */}
                    <motion.div
                      className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden"
                      style={{
                        border: `2px solid ${colorStyles.border}`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 15px ${colorStyles.shadow}`,
                          `0 0 25px ${colorStyles.shadow}`,
                          `0 0 15px ${colorStyles.shadow}`,
                        ],
                        y: ["0%", "-5%", "0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      {/* zkSnack on top of plate */}
                      <motion.div className="absolute">
                        <Image
                          width={500}
                          height={500}
                          src={snack.image || "/placeholder.svg"}
                          alt={snack.name}
                          className="object-contain drop-shadow-lg"
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Text and button below plate */}
                  <div className="text-center mt-4 w-56 sm:w-64">
                    <h3 className="text-xl font-bold text-[#333] mb-2">
                      {snack.name}
                    </h3>
                    <p className="text-[#555] text-sm mb-5">
                      {snack.description}
                    </p>

                    {claimedSnacks.includes(snack.id) ? (
                      <Button
                        disabled
                        className={`w-full ${colorStyles.disabledButton} cursor-not-allowed`}
                      >
                        Claimed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleClaim(snack.id)}
                        className={`w-full ${colorStyles.button} text-white shadow-md`}
                      >
                        Get
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#f3eadf] p-2 sm:p-3 rounded-full text-[#4780ba] hover:bg-[#e7dfd4] transition-colors border border-[#4780ba]/20 shadow-md"
          aria-label="Scroll right"
        >
          <ChevronRight size={isMobile ? 20 : 24} />
        </button>
      </div>
    </div>
  );
}
