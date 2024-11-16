"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import DueDateGrid from "@/components/card/pagetwo/DueDateGrid";
import Grid from "@/components/card/pagetwo/Grid";
import { CheckIcon, XIcon } from "lucide-react";
import { LoadingState } from "@/constants/loading-state";

interface AccountDetails {
  school_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  role: string;
  is_activated: boolean;
  year_level: string;
  course: string;
  // Add other fields as needed
}

const myFont = localFont({ src: "./../../fonts/TimesNewRoman.woff2" });

const PageTwo = () => {
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const studentId = params.studentId as string;

  useEffect(() => {
    const fetchAccount = async () => {
      if (!studentId) {
        setError("No student ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const url = `/api/profile/student/${studentId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAccount(data);
      } catch (error) {
        setError("Failed to fetch account details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccount();
  }, [studentId]);

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error: {error}</div>;
  if (!account) return <div>No account found</div>;

  return (
    <div
      className={cn(
        "dark:text-black space-y-2 mt-10 mx-5 h-[720px] py-5 bg-customYellow justify-center items-center",
        myFont.className
      )}
    >
      <div>
        <DueDateGrid />
        <Grid />
      </div>
    </div>
  );
};

export default PageTwo;
