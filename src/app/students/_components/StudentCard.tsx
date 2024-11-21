import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProviders";
import { useFetchUser } from "@/utils/useFetchUser";
import { cn } from "@/lib/utils";
import DueDateGrid from "@/components/card/DueDateGrid";
import Grid from "@/components/card/Grid";
import { Account } from "@/types";
import { BookTransactionByAccountId } from "./BookTransactionByAccountId";
import AutoReloadWrapper from "@/components/card/EditorMode/AutoReloadWrapper";
import ClearanceCheckboxes from "@/components/clearance/ClearanceCheckboxes";

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
  const pathname = usePathname();
  const schoolId = pathname.split("/").pop() || "";
  const auth = useAuth();
  const { data: userData, error, isLoading } = useFetchUser();

  // Handle authentication error
  React.useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <span className="ml-3.5 w-56 card-field">
            {mappedCourse} - {account.year_level}
          </span>
          <span className="pl-5 card-text">Section:</span>
          <span className="ml-3.5 w-36 card-field">Undefined</span>
        </div>

        <div className="pt-10">
          <DueDateGrid />
          <Grid mode={isCheckerMode} />
        </div>

        <div className="pt-2 px-10">
          <ClearanceCheckboxes
            schoolId={schoolId}
            clearedBy={userData?.username || ""}
          />
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
