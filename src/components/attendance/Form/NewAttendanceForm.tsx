"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import BaggageForm from "./BaggageForm";
import AnimatedWelcome from "../animated-welcome";
import AnimatedThanks from "../animated-thanks";
import IdInput from "./IdInput";
import FooterGreetings from "./FooterGreetings";
import ServiceSelection from "./ServiceSelection";
import { env } from "@/env";
import { Attendance, StudentInfo } from "@/types/attendanceform";

import Gradient from "../static/Gradient";
import dynamic from "next/dynamic";
import { useAttendanceSubmission } from "../utils/useAttendanceSubmission";

const Clock = dynamic(() => import("@/components/attendance/static/Clock"), {
  ssr: false,
});

export default function NewAttendanceForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [hasBaggage, setHasBaggage] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    submissionData,
    baggageNumber,
    connectionStatus,
    resetSubmissionData,
  } = useAttendanceSubmission(studentId);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Memoize resetForm to prevent unnecessary recreations
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setStudentId("");
    setSelectedService("");
    setHasBaggage(null);
    resetSubmissionData();
    setStudentInfo(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [resetSubmissionData]);

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

  useEffect(() => {
    if (connectionStatus === "error") {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description:
          "WebSocket connection error. Some features may be unavailable.",
      });
    }
  }, [connectionStatus, toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 4 && submissionData) {
      timer = setTimeout(resetForm, 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentStep, submissionData, resetForm]);

  const formattedTime = currentTime
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .toLowerCase();

  const verifyAccount = async (inputVal: string) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${inputVal}/`);

      if (!response.ok) {
        throw new Error("Account not found");
      }

      const data: StudentInfo = await response.json();
      console.log(
        `Full name: ${data.first_name} ${data.middle_name} ${data.last_name}`
      );
      setStudentInfo(data);
      setCurrentStep(2);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Account Not Found",
        description: "Please check the student ID and try again.",
      });
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  };

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
      setCurrentStep(4);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit attendance. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidAttendance = (data: any): data is Attendance => {
    return (
      data &&
      typeof data.school_id === "string" &&
      typeof data.first_name === "string" &&
      typeof data.middle_name === "string" &&
      typeof data.last_name === "string"
    );
  };

  return (
    <Card className="w-full z-[1] bg-transparent outline-none border-none">
      <CardContent className="p-6 flex">
        {/* Left side */}
        <div className="w-1/4 pr-6">
          <AnimatedWelcome />
          <IdInput
            studentId={studentId}
            onChange={setStudentId}
            onEnter={() => verifyAccount(studentId)}
            disabled={currentStep !== 1}
            ref={inputRef}
          />
        </div>

        {/* Right side */}
        <div className="w-3/4 pl-6 pr-24 relative">
          {/* Cancel Button - Only show for steps 2 and 3 */}
          {(currentStep === 2 || currentStep === 3) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.5 }}
            >
              <button
                className="px-2.5 py-1 rounded-lg absolute right-28 -top-14 flex items-center border border-red-500 bg-gradient-to-r from-rose-300 to-red-500 text-white transition-all duration-200 shadow-lg "
                onClick={resetForm}
              >
                <X className="w-5 h-5 mr-2 transition-transform duration-300 ease-out group-hover:rotate-90" />
                <span className="relative font-black">CANCEL</span>
              </button>
            </motion.div>
          )}

          {currentStep === 4 &&
          submissionData &&
          isValidAttendance(submissionData) ? (
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
            <ServiceSelection onServiceSelect={handleServiceSelect} />
          ) : null}
        </div>
      </CardContent>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 text-white py-2">
        <div className="container flex justify-between items-center px-10 py-5">
          <p className="text-5xl font-bold drop-shadow">
            <Gradient>
              <Clock />
            </Gradient>
          </p>
          <FooterGreetings
            currentStep={currentStep}
            studentInfo={studentInfo}
          />
        </div>
      </div>
    </Card>
  );
}
