import DailyStatsRecord from "@/components/DailyStatsRecord";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";

const AttendancePage = () => {
  redirect(`/attendance/${format(new Date(), "yyyy-MM-dd")}`);

  return (
    <div className="flex flex-col justify-center items-center gap-10 p-10">
      <DailyStatsRecord />
    </div>
  );
};

export default AttendancePage;
