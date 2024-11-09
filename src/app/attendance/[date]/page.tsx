import DailyStatsRecord2 from "@/components/DailyStatsRecord2";
import { env } from "@/env";
import { AttendanceV2 } from "@/types";
import getCurrentUser from "@/utils/getCurrentUser";
import isValidDate from "@/utils/isValidDate";
import axios from "axios";
import { format } from "date-fns";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

const fetchData = async (date: string) => {
  const user = await getCurrentUser();

  if (!user?.is_staff) {
    redirect("/dashboard", RedirectType.replace);
  }

  if (!isValidDate(date)) {
    return [];
  }

  try {
    // const response = await axios<Attendance[]>(
    //   `${env.NEXT_PUBLIC_API_URL}/attendance/csv/${date}/${date}/`
    // );
    const response = await axios<AttendanceV2[]>(
      `${env.NEXT_PUBLIC_API_URL}/attendanceV2`
    );

    return response.data;
  } catch (error) {
    return [];
  }
};

const AttendancePage = async ({ params }: { params: { date: string } }) => {
  const attendanceLogs = await fetchData(params?.date);

  return (
    <div className="flex flex-col justify-center items-center gap-10 p-10">
      <DailyStatsRecord2 attendanceLogs={attendanceLogs} date={params?.date} />
    </div>
  );
};

export default AttendancePage;
