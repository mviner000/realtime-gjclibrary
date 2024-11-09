"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import DueDateGrid from "@/components/card/DueDateGrid";
import Grid from "@/components/card/Grid";
import { CheckIcon, XIcon } from "lucide-react";
import { LoadingState } from "@/constants/loading-state";
import Link from "next/link";
import AutoReloadWrapper from "@/components/card/EditorMode/AutoReloadWrapper";

interface AccountDetails {
  school_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  role: string;
  is_activated: boolean;
  year_level: string;
  course: string;
  current_cropped_avatar: string;
  // Add other fields as needed
}

const myFont = localFont({ src: "./../../../fonts/TimesNewRoman.woff2" });

const StudentDetails = () => {
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
      ``;
    };

    fetchAccount();
  }, [studentId]);

  if (isLoading) return <LoadingState />;
  if (error) return <div>Error: {error}</div>;
  if (!account) return <div>No account found</div>;

  return (
    <div className="grid grid-cols-4">
      <div></div>
      <div className="col-span-2 w-[920px] align-middle relative">
        <div className="pl-8 pt-8">
          <Link
            className="hover:bg-emerald-400/80 p-2 bg-purple-300 text-black rounded-md"
            href="/dashboard"
          >
            Back
          </Link>
        </div>
        <div
          className={cn(
            "dark:text-black space-y-2 mt-10 mx-5 h-[740px] py-5",
            account.role === "Student"
              ? "bg-customYellow"
              : account.role === "Teacher"
              ? "bg-blue-500"
              : "",
            "justify-center items-center",
            myFont.className
          )}
        >
          <div className="absolute text-right right-12 top-48">
            <img
              src={account.current_cropped_avatar}
              alt="Student Avatar"
              className="w-32 h-32"
            />
          </div>
          <div className="flex flex-row justify-between">
            <div className="pl-10 font-bold text-black text-xl">
              {account.role === "student"
                ? "STUDENT "
                : account.role === "Teacher"
                ? "FACULTY "
                : ""}
              BORROWERS CARD
            </div>
            <div className="-space-y-2">
              <div className="pr-10 font-semibold text-black text-lg">
                GJC Library
              </div>
              <div className="pr-10 font-semibold text-black text-lg">
                San Isidro, N.E.
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <span className="pl-10 font-bold text-black text-xl">Name:</span>
            <span className="ml-2 border-b border-black w-96 font-semibold text-black text-xl">
              {account.last_name}, {account.first_name} {account.middle_name}
            </span>
          </div>
          <div className="flex flex-row pb-10">
            <span className="pl-10 font-bold text-black text-xl">Year:</span>
            <span className="ml-3.5 border-b border-black w-36 font-bold text-black text-xl">
              {account.course} - {account.year_level}
            </span>
            <span className="pl-5 font-bold text-black text-xl">Section:</span>
            <span className="ml-3.5 border-b border-black w-36 font-bold text-black text-xl">
              Undefined
            </span>
          </div>
          <div className="pt-10">
            <DueDateGrid />

            <AutoReloadWrapper>
              <Grid />
            </AutoReloadWrapper>
          </div>
          <div className="pl-10 pt-5 flex text-lg font-semibold gap-2">
            <span>School ID: {account.school_id}</span>- Account Activated:
            {account.is_activated ? (
              <span>
                <CheckIcon />
              </span>
            ) : (
              <span className="text-rose-500">
                <XIcon />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
