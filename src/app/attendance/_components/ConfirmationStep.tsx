import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormData, SubmissionData } from "@/types/attendance";

type ConfirmationStepProps = {
  formData: FormData;
  submissionData: SubmissionData;
  baggageNumber: number | null;
  onReset: () => void;
};

const ConfirmationStep = ({
  formData,
  submissionData,
  baggageNumber,
  onReset,
}: ConfirmationStepProps) => {
  const [countdown, setCountdown] = useState(5);
  const firstName = submissionData?.first_name || "";
  const lastName = submissionData?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReset]);

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold">Thanks for visiting us!</h2>
      <div className="text-lg space-y-2">
        {fullName && <p>Welcome, {fullName}!</p>}
        <p>School ID: {formData.schoolId}</p>
        <p>Purpose: {formData.purpose.replace(/_/g, " ").toUpperCase()}</p>
        {formData.hasBaggage && baggageNumber && (
          <p className="font-semibold text-blue-600">
            Your baggage counter number is: #{baggageNumber}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Time-in: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          Automatically redirecting in {countdown}...
        </p>
      </div>

      {/* <Button onClick={onReset} className="w-full mt-2">
        New Entry
      </Button> */}
    </div>
  );
};

export default ConfirmationStep;
