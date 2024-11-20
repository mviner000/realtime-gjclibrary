import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  trigger,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
}) => {
  const [hoveredButton, setHoveredButton] = useState<
    "confirm" | "cancel" | null
  >(null);

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
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-green-100 to-yellow-100 p-0 overflow-hidden">
        <Card className="w-full border-none bg-transparent">
          <CardContent className="p-8">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-6xl font-semibold text-center mb-12 text-green-800">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-xl text-gray-700 mb-8">
                {description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-center gap-8 mb-8 mt-10">
              <AnimatePresence>
                <Button
                  variant="outline"
                  className={`w-64 h-64 rounded-md border-4 ${
                    hoveredButton === "cancel"
                      ? "bg-yellow-200 border-yellow-500 dark:bg-yellow-200"
                      : "bg-yellow-50 border-yellow-300 dark:bg-yellow-50"
                  } relative overflow-hidden transition-all duration-300 ease-in-out`}
                  onClick={() => {}}
                  onMouseEnter={() => setHoveredButton("cancel")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isLoading}
                  asChild
                >
                  <AlertDialogCancel className="w-full h-full">
                    <motion.div
                      className="flex flex-col items-center justify-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-3xl font-bold text-yellow-700">
                        {cancelText}
                      </span>
                    </motion.div>
                    {hoveredButton === "cancel" && (
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
                  </AlertDialogCancel>
                </Button>
              </AnimatePresence>
              <AnimatePresence>
                <Button
                  variant="outline"
                  className={`w-64 h-64 rounded-md border-4 ${
                    hoveredButton === "confirm"
                      ? "bg-green-200 border-green-500 dark:bg-green-200"
                      : "bg-green-50 border-green-300 dark:bg-green-50"
                  } relative overflow-hidden transition-all duration-300 ease-in-out`}
                  onClick={onConfirm}
                  onMouseEnter={() => setHoveredButton("confirm")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={isLoading}
                  asChild
                >
                  <AlertDialogAction className="w-full h-full">
                    <motion.div
                      className="flex flex-col items-center justify-center gap-2"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-3xl font-bold text-green-700">
                        {confirmText}
                      </span>
                    </motion.div>
                    {hoveredButton === "confirm" && (
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
                  </AlertDialogAction>
                </Button>
              </AnimatePresence>
            </AlertDialogFooter>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
