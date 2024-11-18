import Gradient from "@/components/Gradient";
import { StudentInfo, Attendance } from "@/types/attendanceform";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Clock = dynamic(() => import("@/components/Clock"), { ssr: false });

type Props = {
  studentDetails: StudentInfo | null;
  currentStep: number;
  setCurrentStep: (num: number) => void;
  responseData: Attendance | null;
};

const FooterGreetings = ({
  studentDetails,
  currentStep,
  setCurrentStep,
  responseData,
}: Props) => {
  const [militaryTime, setMilitaryTime] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMilitaryTime(
        localStorage.getItem("militaryTime") === "true" ? true : false
      );
    }
  }, []);

  const toggleMilitaryTime = () => {
    localStorage.setItem("militaryTime", String(!militaryTime));
    setMilitaryTime(!militaryTime);
  };

  const text = studentDetails
    ? currentStep === 3
      ? "Do you have any baggage with you today?"
      : `Hello ${studentDetails?.first_name}! What brings you to the library today?`
    : "Please scan your QR Code";

  return (
    <div className="z-10 flex w-full items-center gap-16 bg-gradient-to-r from-[#035A19] to-[#E0A000]/75 px-16 py-4 font-oswald">
      <p className="text-5xl font-bold drop-shadow">
        <Gradient>
          <Clock militaryTime={militaryTime} />
        </Gradient>
      </p>

      <div className="ml-4 text-4xl font-semibold drop-shadow">
        {currentStep === 4 && responseData ? (
          <TimedMessage
            message="Your quote of the day. Wait to finish loading..."
            duration={3}
            setCurrentStep={setCurrentStep}
          />
        ) : currentStep === 3 ? (
          text
        ) : (
          text
        )}
      </div>
    </div>
  );
};

type TimedMessageProps = {
  message: string;
  duration: number;
  setCurrentStep: (num: number) => void;
};

const TimedMessage = ({
  message,
  duration,
  setCurrentStep,
}: TimedMessageProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      setCurrentStep(1);
    }, duration * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [duration, setCurrentStep]);

  return `${message} (${timeLeft})`;
};

export default FooterGreetings;
