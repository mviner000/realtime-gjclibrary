"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BaggageForm from "./BaggageForm";
import AnimatedWelcome from "./animated-welcome";
import AnimatedThanks from "./animated-thanks";
import { env } from "@/env";

interface ServiceOption {
  icon: string;
  label: string;
  value: string;
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

export default function NewAttendanceForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [hasBaggage, setHasBaggage] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [baggageNumber, setBaggageNumber] = useState<number | null>(null);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/ws/attendance/`);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notify_clients") {
        console.log("Received update:", data);

        if (
          data.action === "created" &&
          data.attendance.school_id === studentId
        ) {
          setBaggageNumber(data.attendance.baggage_number);
          setSubmissionData(data.attendance);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [studentId, WS_URL]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStep === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const formattedTime = currentTime
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .toLowerCase();

  const handleServiceSelect = (value: string) => {
    setSelectedService(value);
    setCurrentStep(3);
  };

  const handleBaggageResponse = async (response: boolean) => {
    setHasBaggage(response);
    await submitAttendance(response);
  };

  const submitAttendance = async (hasBaggage: boolean) => {
    setIsSubmitting(true);
    try {
      const currentDate = new Date().toISOString();
      const attendanceData = {
        school_id: studentId,
        purpose: selectedService,
        status: "time_in",
        has_baggage: hasBaggage,
        date: currentDate.split("T")[0],
        time_in_date: currentDate,
      };

      const response = await fetch(`${API_URL}/v2/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSubmissionData(data);
      if (data.baggage_number) {
        setBaggageNumber(data.baggage_number);
      }
      setCurrentStep(4);
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    console.log("Resetting form..."); // Debug log
    setCurrentStep(1);
    setStudentId("");
    setSelectedService("");
    setHasBaggage(null);
    setBaggageNumber(null);
    setSubmissionData(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 4 && submissionData) {
      console.log("Setting up auto-reset timer..."); // Debug log
      timer = setTimeout(() => {
        console.log("Auto-reset triggered"); // Debug log
        resetForm();
      }, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentStep, submissionData]);

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

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
    <Card className="w-full mx-16 bg-transparent outline-none border-none">
      <CardContent className="p-6 flex">
        {/* Left side */}
        <div className="w-1/4 pr-6">
          <AnimatedWelcome />
          <div className="space-y-6 text-center">
            <div className="mx-auto w-full max-w-[360px] aspect-square relative rounded-lg overflow-hidden group">
              <Image
                src="/images/gjchomepagelink.png"
                alt="QR Code"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-yellow-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <Input
              id="studentId"
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full max-w-2xl text-center text-2xl bg-white/90 text-green-800 placeholder:text-green-600/70 
                   border-4 border-green-600 
                   transition-all duration-300 rounded-xl py-6 px-4 shadow-lg"
              ref={inputRef}
              onKeyPress={(e) => {
                if (e.key === "Enter" && studentId.trim() !== "") {
                  setCurrentStep(2);
                }
              }}
              disabled={currentStep !== 1}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="w-3/4 pl-6 pr-24">
          {currentStep === 4 ? (
            <AnimatedThanks
              studentId={studentId}
              selectedService={selectedService}
              hasBaggage={!!hasBaggage}
              baggageNumber={baggageNumber}
              formattedTime={formattedTime}
              resetForm={resetForm}
              attendance={submissionData}
            />
          ) : currentStep === 3 ? (
            <BaggageForm
              onResponse={handleBaggageResponse}
              isSubmitting={isSubmitting}
            />
          ) : currentStep === 2 ? (
            <Card className="w-full mx-auto overflow-hidden bg-gradient-to-br from-green-100 to-yellow-100">
              <CardContent className="p-6">
                <h2 className="text-5xl font-semibold text-center mb-6 text-green-800">
                  Select your purpose:
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {serviceOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-32 rounded-md border-4 ${
                          hoveredButton === option.value
                            ? "bg-green-200 border-green-500 dark:bg-green-200"
                            : "bg-green-50 border-green-300 dark:bg-green-50"
                        } relative overflow-hidden`}
                        onClick={() => handleServiceSelect(option.value)}
                        onMouseEnter={() => setHoveredButton(option.value)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Image
                            src={option.icon}
                            alt={option.label}
                            width={32}
                            height={32}
                          />
                          <span className="text-2xl text-center font-bold text-green-700">
                            {option.label}
                          </span>
                        </div>
                        {hoveredButton === option.value && (
                          <motion.div
                            className="absolute inset-0 bg-green-300 opacity-20"
                            variants={shimmer}
                            initial="hidden"
                            animate="visible"
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </CardContent>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 text-white py-2">
        <div className="container flex justify-between items-center px-10 py-5">
          <div className="text-3xl font-mono">{formattedTime}</div>
          <div className="text-3xl font-bold">
            {currentStep === 1 && "Please scan your QR Code"}
            {currentStep === 2 &&
              `Hello ${submissionData?.first_name || "STUDENT"}! What brings you to the library today?`}
            {currentStep === 3 && "Do you have any baggage with you today?"}
            {currentStep === 4 && "Thank you for using our service!"}
          </div>
        </div>
      </div>
    </Card>
  );
}