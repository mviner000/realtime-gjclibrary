"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import localFont from "next/font/local";
import Link from "next/link";
import { useStudentDetails } from "@/hooks/useStudentDetails";
import { LoadingState } from "@/constants/loading-state";
import ErrorDisplay from "../_components/ErrorDisplay";
import BookCardApproval from "../_components/BookCardApproval";
import { ComboboxPopoverForCheckerEditorMode } from "../_components/ComboboxPopoverForCheckerEditorMode";
import PageTwo from "../_components/PageTwo";
import { Button } from "@/components/ui/button";
import StudentCardWrapper from "../_components/StudentCardWrapper";

const myFont = localFont({ src: "./../../fonts/TimesNewRoman.woff2" });

const StudentDetails = () => {
  const params = useParams();

  const studentId = params.studentId as string;
  const { account, isLoading, error, handleApprovalChange } =
    useStudentDetails(studentId);

  const [isCheckerMode, setIsCheckerMode] = useState<
    "editor" | "checker" | "viewer"
  >("editor");
  const [showPageTwo, setShowPageTwo] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("showPageTwo");
    if (savedState === "true") {
      setShowPageTwo(true);
    }
  }, []);

  const handleModeChange = (mode: { value: string } | null) => {
    if (mode) {
      setIsCheckerMode(mode.value as "editor" | "checker" | "viewer");
    }
  };

  const handleAddPageTwo = () => {
    const newShowPageTwo = !showPageTwo;
    setShowPageTwo(newShowPageTwo);
    localStorage.setItem("showPageTwo", newShowPageTwo.toString());
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorDisplay error={error} />;
  if (!account) return <div>No account found</div>;

  return (
    <>
      <div className="ml-5 pb-10">
        <div className="w-full align-middle relative">
          <div className="container pt-8 space-x-2 flex w-full justify-between">
            <div className="flex gap-2">
              <Link
                className="hover:bg-emerald-400/80 p-2 text-black dark:text-white bg-transparent outline outline-1 outline-black dark:outline-white rounded-md"
                href="/students"
              >
                Back
              </Link>
            </div>
            <ComboboxPopoverForCheckerEditorMode
              onModeChange={handleModeChange}
            />
            <div className="w-[920px]">
              <BookCardApproval
                userId={account.school_id}
                approveId={studentId}
                isBookCardPhotoApproved={account.isBookCardPhotoApproved}
                onApprovalChange={handleApprovalChange}
              />
            </div>
          </div>
          <StudentCardWrapper
            account={account}
            fontClass={myFont.className}
            isCheckerMode={isCheckerMode}
          />
        </div>
      </div>
      <div className="flex p-4 ml-6 -mt-15 pb-5">
        <Button className="" onClick={handleAddPageTwo}>
          {showPageTwo ? "Hide Page 2" : "Add Page 2"}
        </Button>
      </div>

      <div className="w-[950px] ml-6 pb-15s">{showPageTwo && <PageTwo />}</div>
    </>
  );
};

export default StudentDetails;
