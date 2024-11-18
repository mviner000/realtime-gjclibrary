"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/env";
import { FormData, SubmissionData } from "@/types/attendance";
import { ProgressBar } from "./ProgressBar";
import { SchoolIDStep } from "./SchoolIDStep";
import { PurposeStep } from "./PurposeStep";
import { BaggageStep } from "./BaggageStep";
import ConfirmationStep from "./ConfirmationStep";

const StepAttendanceForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    schoolId: "",
    purpose: "",
    hasBaggage: "",
  });
  const [baggageNumber, setBaggageNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  // Use the dedicated WS_URL from env
  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    // Create WebSocket connection with the correct path
    // Remove 'api' from the path since it's already handled in Django routing
    const ws = new WebSocket(`${WS_URL}/ws/attendance/`);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notify_clients") {
        console.log("Received WebSocket data:", data);
        if (
          data.action === "created" &&
          data.attendance.school_id === formData.schoolId
        ) {
          setBaggageNumber(data.attendance.baggage_number);
          setSubmissionData(data.attendance);
        }
      }
    };

    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [formData.schoolId]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (hasBaggage: boolean) => {
    setIsSubmitting(true);
    try {
      const currentDate = new Date().toISOString();
      const attendanceData = {
        school_id: formData.schoolId,
        purpose: formData.purpose,
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
      setFormData((prev) => ({ ...prev, hasBaggage }));
      handleNextStep();
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      schoolId: "",
      purpose: "",
      hasBaggage: "",
    });
    setBaggageNumber(null);
    setSubmissionData(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <ProgressBar currentStep={currentStep} totalSteps={4} />
        {currentStep === 1 && (
          <SchoolIDStep
            schoolId={formData.schoolId}
            onSchoolIdChange={(value) =>
              setFormData({ ...formData, schoolId: value })
            }
            onNext={handleNextStep}
          />
        )}
        {currentStep === 2 && (
          <PurposeStep
            purpose={formData.purpose}
            onPurposeChange={(value) =>
              setFormData({ ...formData, purpose: value })
            }
            onNext={handleNextStep}
          />
        )}
        {currentStep === 3 && (
          <BaggageStep
            isSubmitting={isSubmitting}
            hasBaggage={formData.hasBaggage}
            onSubmit={handleSubmit}
          />
        )}
        {currentStep === 4 && submissionData && (
          <ConfirmationStep
            formData={formData}
            submissionData={submissionData}
            baggageNumber={baggageNumber}
            onReset={handleReset}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StepAttendanceForm;
