import React from "react";
import { cn } from "@/lib/utils";
import DueDateGrid from "@/components/card/DueDateGrid";
import Grid from "@/components/card/Grid";
import { CheckIcon, XIcon } from "lucide-react";
import ApprovalStatus from "./ApprovalStatus";
import { Account } from "@/types";
import { BookTransactionByAccountId } from "./BookTransactionByAccountId";
import AutoReloadWrapper from "@/components/card/EditorMode/AutoReloadWrapper";

interface StudentCardProps {
  account: Account;
  fontClass: string;
  isCheckerMode: "editor" | "checker" | "viewer";
}

const courseMapping: { [key: string]: string } = {
  "JUNIOR HIGH SCHOOL": "JHS",
  "Accountancy, Business and Management (ABM)": "ABM",
  "Science, Technology, Engineering and Mathematics": "STEM",
  "Humanities and Social Sciences": "HUMMS",
  "General Academic Strand": "GAS",
};

const StudentCard: React.FC<StudentCardProps> = ({
  account,
  fontClass,
  isCheckerMode,
}) => {
  const cardBgColor =
    account.role === "Student"
      ? "bg-customYellow"
      : account.role === "Teacher"
      ? "bg-blue-500"
      : "";

  const getMappedCourse = (course: string | null): string => {
    if (course === null) return "N/A";
    return courseMapping[course] || course;
  };

  const mappedCourse = getMappedCourse(account.course);

  return (
    <div className="flex">
      <div
        className={cn(
          "dark:text-black space-y-2 mb-10 mx-5 mt-5 h-[870px] py-5 w-[920px]",
          cardBgColor,
          "justify-center items-center",
          fontClass
        )}
      >
        <div className="absolute left-[750px] top-48">
          <img
            src={account.current_cropped_image || "/images/placeholder.jpg"}
            alt="Student Avatar"
            className="w-32 h-32"
          />
        </div>

        <div className="flex justify-between">
          <div className="pl-10 card-text">
            {account.role === "Student"
              ? "STUDENT "
              : account.role === "Teacher"
              ? "FACULTY "
              : ""}
            BORROWERS CARD
          </div>
          <div className="-space-y-2 pr-10">
            <div className="card-subtext">GJC Library</div>
            <div className="card-subtext">San Isidro, N.E.</div>
          </div>
        </div>

        <div className="card-section">
          <span className="pl-10 card-text">Name:</span>
          <span className="ml-2 w-96 card-field">
            {account.last_name}, {account.first_name} {account.middle_name}
          </span>
        </div>

        <div className="card-section pb-10">
          <span className="pl-10 card-text">Year:</span>
          <span className="ml-3.5 w-36 card-field">
            {mappedCourse} - {account.year_level}
          </span>
          <span className="pl-5 card-text">Section:</span>
          <span className="ml-3.5 w-36 card-field">Undefined</span>
        </div>

        <div className="pt-10">
          <DueDateGrid />
          <Grid mode={isCheckerMode} />
        </div>

        <div className="flex justify-between w-full">
          <div className="pl-10 pt-5 flex text-lg font-semibold gap-2">
            Account Password Changed:
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
          <div className="pr-8 pt-5 flex text-lg font-semibold gap-2">
            Book Card Photo Approval Status:{" "}
            <ApprovalStatus status={account.isBookCardPhotoApproved} />
          </div>
        </div>
      </div>
      <div className="w-[320px]">
        <AutoReloadWrapper>
          <div className="mt-5">
            <BookTransactionByAccountId />
          </div>
        </AutoReloadWrapper>
      </div>
    </div>
  );
};

export default StudentCard;
