"use client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { StudentInfo } from "@/types/attendanceform";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  studentDetails: StudentInfo | null;
  setCurrentStep: (num: number) => void;
  setStudentDetails: (detail: StudentInfo) => void;
};

const InputID = ({
  setCurrentStep,
  setStudentDetails,
  studentDetails,
}: Props) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleVerify = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const { data } = await axios.get<StudentInfo>(
        `${env.NEXT_PUBLIC_API_URL!}/accounts/${inputVal}/`
      );

      setStudentDetails(data);
      setCurrentStep(2);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;

      console.error("API Error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: axiosError.config,
      });

      toast({
        title: "Error",
        description:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to verify ID. Please try again.",
        variant: "destructive",
      });

      console.error("API Error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        config: axiosError.config,
        message: axiosError.message,
      });

      setIsError(true);
      setInputVal("");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (!studentDetails) {
      setInputVal("");
    }
  }, [studentDetails]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder={isError ? "ID Not Found. Please try again." : "Student ID"}
        className={cn(
          isError ? "placeholder:text-red-600" : "placeholder:text-[#CBD5E1]",
          "w-full min-w-[370px] max-w-[457px] border border-customGreen2 bg-black/45 py-6 text-center text-xl text-white outline-none placeholder:font-medium"
        )}
        maxLength={8}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputVal) {
            handleVerify();
          }
        }}
        disabled={isLoading || inputVal === studentDetails?.school_id}
        autoFocus
      />

      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-customGreen2" />
      )}
    </div>
  );
};

export default InputID;
