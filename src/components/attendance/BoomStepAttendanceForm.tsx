"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

const StepAttendanceForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolId: "",
    purpose: "",
    hasBaggage: "" as boolean | "",
  });
  const [baggageNumber, setBaggageNumber] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = API_URL.replace("http", "ws");

  const PURPOSE_OPTIONS = [
    "transaction",
    "research",
    "clearance",
    "orientation_or_meeting",
    "silver_star",
    "others",
    "reading_study_or_review",
    "xerox",
    "print",
    "computer_use",
  ];

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
          data.attendance.school_id === formData.schoolId
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Welcome! Please enter your School ID
            </h2>
            <Input
              type="text"
              value={formData.schoolId}
              onChange={(e) =>
                setFormData({ ...formData, schoolId: e.target.value })
              }
              placeholder="Enter School ID"
              className="w-full"
              required
            />
            <Button
              onClick={handleNextStep}
              disabled={!formData.schoolId}
              className="w-full"
            >
              Next
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              What brings you here today?
            </h2>
            <select
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Purpose</option>
              {PURPOSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
            <Button
              onClick={handleNextStep}
              disabled={!formData.purpose}
              className="w-full"
            >
              Next
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Do you have any baggage?</h2>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                variant={formData.hasBaggage === true ? "default" : "outline"}
              >
                Yes
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                variant={formData.hasBaggage === false ? "default" : "outline"}
              >
                No
              </Button>
            </div>
          </div>
        );

      case 4:
        const firstName = submissionData?.first_name || "";
        const lastName = submissionData?.last_name || "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ");

        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Thanks for visiting us!</h2>
            <div className="text-lg space-y-2">
              {fullName && <p>Welcome, {fullName}!</p>}
              <p>School ID: {formData.schoolId}</p>
              <p>
                Purpose: {formData.purpose.replace(/_/g, " ").toUpperCase()}
              </p>
              {formData.hasBaggage && baggageNumber && (
                <p className="font-semibold text-blue-600">
                  Your baggage counter number is: #{baggageNumber}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-4">
                Time-in: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  schoolId: "",
                  purpose: "",
                  hasBaggage: "",
                });
                setBaggageNumber(null);
                setSubmissionData(null);
              }}
              className="w-full mt-6"
            >
              New Entry
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-1/4 h-2 mx-1 rounded ${
                  step <= currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 text-center">
            Step {currentStep} of 4
          </div>
        </div>
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default StepAttendanceForm;
