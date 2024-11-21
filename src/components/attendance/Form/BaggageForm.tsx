"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, XCircle, AlertCircle, Backpack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BaggageFormProps {
  onResponse: (hasBaggage: boolean) => void;
  isSubmitting: boolean;
}

export default function Component(
  { onResponse, isSubmitting }: BaggageFormProps = {
    onResponse: () => {},
    isSubmitting: false,
  }
) {
  const [hoveredButton, setHoveredButton] = useState<"yes" | "no" | null>(null);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = "Do you have any baggage with you today?";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText((prev) => fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

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
    <Card className="absolute -top-24 left-36 max-w-4xl mx-auto overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100">
      <CardContent className="p-8">
        <h2 className="text-6xl font-semibold text-center mb-12 text-green-800 h-24">
          {typedText}
        </h2>
        <div className="flex justify-center gap-8 mb-8">
          <AnimatePresence>
            <Button
              variant="outline"
              className={`w-64 h-64 rounded-md border-4 ${
                hoveredButton === "yes"
                  ? "bg-green-200 border-green-500 dark:bg-green-200"
                  : "bg-green-50 border-green-300 dark:bg-green-50"
              } relative overflow-hidden transition-all duration-300 ease-in-out`}
              onClick={() => onResponse(true)}
              onMouseEnter={() => setHoveredButton("yes")}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={isSubmitting}
            >
              <motion.div
                className="flex flex-col items-center justify-center gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <img src="/images/bag.svg" alt="bag" className="w-28 h-auto" />
                {/* <Backpack className="w-24 h-24 text-green-600" /> */}
                <span className="text-3xl font-bold text-green-700">YES</span>
              </motion.div>
              {hoveredButton === "yes" && (
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
          </AnimatePresence>
          <AnimatePresence>
            <Button
              variant="outline"
              className={`w-64 h-64 rounded-md border-4 ${
                hoveredButton === "no"
                  ? "bg-yellow-200 border-yellow-500 dark:bg-yellow-200"
                  : "bg-yellow-50 border-yellow-300 dark:bg-yellow-50"
              } relative overflow-hidden transition-all duration-300 ease-in-out`}
              onClick={() => onResponse(false)}
              onMouseEnter={() => setHoveredButton("no")}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={isSubmitting}
            >
              <motion.div
                className="flex flex-col items-center justify-center gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <XCircle className="w-24 h-24 text-yellow-600" />
                <span className="text-3xl font-bold text-yellow-700">NO</span>
              </motion.div>
              {hoveredButton === "no" && (
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
          </AnimatePresence>
        </div>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center">
            <AlertCircle className="w-6 h-6 text-gray-800 mr-2" />
            <p className="text-gray-800 font-medium text-lg">
              Please, select the correct answer here, for providing you the
              baggage number needed
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
