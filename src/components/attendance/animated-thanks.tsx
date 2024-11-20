import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package } from "lucide-react";
import { Attendance } from "@/types/attendanceform";

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
            <p className="text-2xl text-green-700">
              Student ID: <span className="font-semibold">{studentId}</span>
            </p>
            <p className="text-2xl text-green-700">
              Name:{" "}
              <span className="font-semibold">{`${attendance.first_name} ${attendance.middle_name} ${attendance.last_name}`}</span>
            </p>
            <p className="text-2xl text-green-700">
              Purpose:{" "}
              <span className="font-semibold">
                {selectedService.replace(/_/g, " ").toUpperCase()}
              </span>
            </p>
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
