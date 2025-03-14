"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";


export const CarouselContext = createContext({
  onCardClose: () => {},
  onCardClick: () => {},
  activeCard: null,
});

export const AppleCardsCarousel = () => {
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => {
    setActiveCard(null);
  });

  const cards = [
    {
      id: 1,
      title: "Smart Budget Planning",
      description: "AI-powered budget recommendations based on your spending patterns",
      image: "/budget-planning.jpeg",
    },
    {
      id: 2,
      title: "Expense Tracking",
      description: "Automatically categorize and track your expenses in real-time",
      image: "/expense-tracking.png",
    },
    {
      id: 3,
      title: "Financial Insights",
      description: "Get personalized insights and recommendations for your finances",
      image: "/financial-insights.png",
    },
  ];

  return (
    <CarouselContext.Provider
      value={{
        onCardClose: () => setActiveCard(null),
        onCardClick: (cardId) => setActiveCard(cardId),
        activeCard,
      }}
    >
      <div ref={containerRef} className="relative h-[40rem] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex gap-4 md:gap-6">
            {cards.map((card) => (
              <Card key={card.id} {...card} />
            ))}
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

const Card = ({ id, title, description, image }) => {
  const { onCardClick, activeCard, onCardClose } = useContext(CarouselContext);
  const isActive = activeCard === id;

  return (
    <motion.div
      layout
      className={cn(
        "relative h-[25rem] w-full rounded-xl bg-white shadow-lg cursor-pointer p-4",
        isActive ? "w-full" : "w-1/3"
      )}
      animate={{
        width: isActive ? "100%" : "33.333%",
        height: isActive ? "30rem" : "25rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onClick={() => {
        if (!isActive) {
          onCardClick(id);
        }
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-200">{description}</p>
        </div>
        {isActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCardClose();
            }}
            className="absolute right-2 top-2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur-lg transition-colors hover:bg-white/40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};
