"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceOption {
  icon: string;
  label: string;
  value: string;
}

interface ServiceSelectionProps {
  onServiceSelect: (value: string) => void;
}

const serviceOptions: ServiceOption[] = [
  {
    icon: "/images/purposes/research.png",
    label: "Research",
    value: "research",
  },
  {
    icon: "/images/purposes/clearance.png",
    label: "Clearance",
    value: "clearance",
  },
  {
    icon: "/images/purposes/orientation_or_meeting.png",
    label: "Orientation/Meeting",
    value: "orientation_or_meeting",
  },
  {
    icon: "/images/purposes/transaction.png",
    label: "Transaction",
    value: "transaction",
  },
  {
    icon: "/images/purposes/silver_star.png",
    label: "Silver Star",
    value: "silver_star",
  },
  {
    icon: "/images/purposes/reading_study_or_review.png",
    label: "Reading/Study/Review",
    value: "reading_study_or_review",
  },
  { icon: "/images/purposes/xerox.png", label: "Xerox", value: "xerox" },
  { icon: "/images/purposes/print.png", label: "Print", value: "print" },
  {
    icon: "/images/purposes/computer_use.png",
    label: "Computer Use",
    value: "computer_use",
  },
];

export default function ServiceSelection({
  onServiceSelect,
}: ServiceSelectionProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const revolvingOutline = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <Card className="w-full mx-auto overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100">
      <CardContent className="p-6">
        <h2 className="text-5xl font-semibold text-center mb-6 text-green-800">
          Select your purpose:
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <AnimatePresence>
            {serviceOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`w-full h-32 rounded-md border-4 ${
                  hoveredButton === option.value
                    ? "bg-green-200 border-green-500 dark:bg-green-200"
                    : "bg-green-50 border-green-300 dark:bg-green-50"
                } relative overflow-hidden transition-all duration-300 ease-in-out`}
                onClick={() => onServiceSelect(option.value)}
                onMouseEnter={() => setHoveredButton(option.value)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <motion.div
                  className="flex flex-col items-center justify-center gap-2"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={56}
                    height={56}
                  />
                  <span className="text-2xl text-center font-bold text-green-700">
                    {option.label}
                  </span>
                </motion.div>
                {hoveredButton === option.value && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-yellow-200 opacity-30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      exit={{ opacity: 0 }}
                    />
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.rect
                        x="2"
                        y="2"
                        width="calc(100% - 4px)"
                        height="calc(100% - 4px)"
                        fill="none"
                        stroke="gold"
                        strokeWidth="4"
                        variants={revolvingOutline}
                        initial="hidden"
                        animate="visible"
                      />
                    </svg>
                  </>
                )}
              </Button>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
