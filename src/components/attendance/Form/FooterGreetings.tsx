"use client";

import { StudentInfo } from "@/types/attendanceform";

interface FooterGreetingsProps {
  currentStep: number;
  studentInfo: StudentInfo | null;
}

export default function FooterGreetings({
  currentStep,
  studentInfo,
}: FooterGreetingsProps) {
  const getGreeting = () => {
    switch (currentStep) {
      case 1:
        return "Please scan your QR Code";
      case 2:
        return `Hello ${studentInfo?.first_name || "STUDENT"}! What brings you to the library today?`;
      case 3:
        return "Do you have any baggage with you today?";
      case 4:
        return "Thank you for using our service!";
      default:
        return "";
    }
  };

  return <div className="text-3xl font-bold">{getGreeting()}</div>;
}
