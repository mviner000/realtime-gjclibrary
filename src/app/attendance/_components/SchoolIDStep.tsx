import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { env } from "@/env";

type SchoolIDStepProps = {
  schoolId: string;
  onSchoolIdChange: (value: string) => void;
  onNext: () => void;
};

export const SchoolIDStep = ({
  schoolId,
  onSchoolIdChange,
  onNext,
}: SchoolIDStepProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const validateSchoolId = async () => {
    if (!schoolId.trim()) {
      setError("Please enter a School ID");
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/accounts/${schoolId}/`);

      if (response.ok) {
        // School ID exists, proceed to next step
        onNext();
      } else if (response.status === 404) {
        setError("School ID not found. Please check and try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error validating school ID:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Welcome! Please enter your School ID
      </h2>
      <div className="space-y-2">
        <Input
          type="text"
          value={schoolId}
          onChange={(e) => {
            onSchoolIdChange(e.target.value);
            setError(null); // Clear error when input changes
          }}
          placeholder="Enter School ID"
          className={`w-full ${error ? "border-red-500" : ""}`}
          required
          disabled={isChecking}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      <Button
        onClick={validateSchoolId}
        disabled={!schoolId || isChecking}
        className="w-full relative"
      >
        {isChecking ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
            Checking...
          </div>
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
};
