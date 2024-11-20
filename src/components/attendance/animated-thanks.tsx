import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, CheckCircle, Package, Spade } from "lucide-react";
import { Attendance } from "@/types/attendanceform";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComponentProps {
  studentId: string;
  selectedService: string;
  hasBaggage: boolean;
  baggageNumber: number | null;
  formattedTime: string;
  resetForm: () => void;
  attendance: Attendance;
}

export default function AnimatedThanks({
  studentId,
  selectedService,
  hasBaggage,
  baggageNumber,
  formattedTime,
  resetForm,
  attendance,
}: ComponentProps) {
  // Add auto-reset functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      resetForm();
    }, 5000); // Reset after 5 seconds

    return () => clearTimeout(timer);
  }, [resetForm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Add countdown indicator */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-green-200"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
      />

      <Card className="w-full max-w-2xl text-center mx-auto overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100 shadow-lg">
        <CardContent className="p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-center mb-6 text-green-800">
            Thanks for visiting us!
          </h2>
          <div className="space-y-4 text-center">
            <div className="border-2 border-yellow-400 relative flex-shrink-0 w-[160px] sm:w-[180px] h-[230px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-100 mx-auto">
              <div className="text-center absolute top-3 left-4 dark:text-black">
                <img src="/images/xmas.svg" alt="bag" className="w-9 h-auto" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-green-600 text-5xl sm:text-9xl font-bold">
                  {attendance.baggage_number ? (
                    attendance.baggage_number
                  ) : (
                    <img
                      src="/images/santa.svg"
                      alt="bag"
                      className="w-28 h-auto"
                    />
                  )}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-black text-lg font-bold truncate text-center">
                  {attendance.first_name} {attendance.middle_name}{" "}
                  {attendance.last_name}
                </p>
              </div>
            </div>
            {hasBaggage && baggageNumber && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 inline-block"
              >
                <p className="flex items-center justify-center text-2xl font-semibold text-yellow-700">
                  <Package className="w-6 h-6 mr-2" />
                  Baggage counter: #{baggageNumber}
                </p>
              </motion.div>
            )}
            {attendance.course && (
              <p className="text-xl text-green-600">
                Course:{" "}
                <span className="font-semibold">{attendance.course}</span>
              </p>
            )}
            {attendance.year_level && (
              <p className="text-xl text-green-600">
                Year Level:{" "}
                <span className="font-semibold">{attendance.year_level}</span>
              </p>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Button
              onClick={resetForm}
              className="w-full max-w-xs mx-auto text-lg bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
            >
              New Entry
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
