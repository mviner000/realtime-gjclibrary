import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BaggageFormProps {
  onResponse: (hasBaggage: boolean) => void;
  isSubmitting: boolean;
}

export default function BaggageForm({
  onResponse,
  isSubmitting,
}: BaggageFormProps) {
  const [hoveredButton, setHoveredButton] = useState<"yes" | "no" | null>(null);

  const shimmer = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 100,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-green-800">
          Do you have any baggage with you today?
        </h2>
        <div className="flex justify-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="outline"
              className={`w-40 h-40 rounded-md border-4 ${
                hoveredButton === "yes"
                  ? "bg-green-200 border-green-500"
                  : "bg-green-50 border-green-300"
              } relative overflow-hidden`}
              onClick={() => onResponse(true)}
              onMouseEnter={() => setHoveredButton("yes")}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={isSubmitting}
            >
              <Briefcase
                className={`w-16 h-16 ${hoveredButton === "yes" ? "text-green-600" : "text-green-500"}`}
              />
              {hoveredButton === "yes" && (
                <motion.div
                  className="absolute inset-0 bg-green-300 opacity-20"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
              )}
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-bold text-green-700">
                YES
              </span>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="outline"
              className={`w-40 h-40 rounded-md border-4 ${
                hoveredButton === "no"
                  ? "bg-yellow-200 border-yellow-500"
                  : "bg-yellow-50 border-yellow-300"
              } relative overflow-hidden`}
              onClick={() => onResponse(false)}
              onMouseEnter={() => setHoveredButton("no")}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={isSubmitting}
            >
              <XCircle
                className={`w-16 h-16 ${hoveredButton === "no" ? "text-yellow-600" : "text-yellow-500"}`}
              />
              {hoveredButton === "no" && (
                <motion.div
                  className="absolute inset-0 bg-yellow-300 opacity-20"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
              )}
              <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-lg font-bold text-yellow-700">
                NO
              </span>
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
