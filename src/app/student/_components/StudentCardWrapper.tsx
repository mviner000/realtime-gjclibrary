import React from "react";
import { BookTransactionsProvider } from "../_hooks/useBookTransactions";
import AutoReloadWrapper from "@/components/card/EditorMode/AutoReloadWrapper";
import StudentCard from "./StudentCard";
import { Account } from "@/types";

interface StudentCardWrapperProps {
  account: Account;
  fontClass: string;
  isCheckerMode: "editor" | "checker" | "viewer";
}

const StudentCardWrapper: React.FC<StudentCardWrapperProps> = ({
  account,
  fontClass,
  isCheckerMode,
}) => {
  return (
    <BookTransactionsProvider accountSchoolId={account.school_id}>
      <StudentCard
        account={account}
        fontClass={fontClass}
        isCheckerMode={isCheckerMode}
      />
    </BookTransactionsProvider>
  );
};

export default StudentCardWrapper;
