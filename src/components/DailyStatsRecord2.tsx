"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import Cookie from "js-cookie";
import { useGlobalStore } from "@/stores/globalStore";
import { Attendance, AttendanceV2 } from "@/types";
import isValidDate from "@/utils/isValidDate";

const timeSlots = [
  "7:00 - 8:00",
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 1:00",
  "1:00 - 2:00",
  "2:00 - 3:00",
  "3:00 - 4:00",
  "4:00 - 5:00",
];

function getTimeSlot(hour: number) {
  if (hour >= 7 && hour < 8) return timeSlots[0];
  if (hour >= 8 && hour < 9) return timeSlots[1];
  if (hour >= 9 && hour < 10) return timeSlots[2];
  if (hour >= 10 && hour < 11) return timeSlots[3];
  if (hour >= 11 && hour < 12) return timeSlots[4];
  if (hour >= 12 && hour < 13) return timeSlots[5];
  if (hour >= 13 && hour < 14) return timeSlots[6];
  if (hour >= 14 && hour < 15) return timeSlots[7];
  if (hour >= 15 && hour < 16) return timeSlots[8];
  if (hour >= 16 && hour < 17) return timeSlots[9];
  return null;
}

type PageProps = {
  attendanceLogs: AttendanceV2[] | [];
  date: string;
};

const DailyStatsRecord2 = ({ attendanceLogs, date }: PageProps) => {
  if (!isValidDate(date)) {
    date = format(new Date(), "yyyy-MM-dd");
  }

  const { setIsPinModalOpen, isLocked } = useGlobalStore();

  const handleClick = async (orientation: string) => {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#tally-table");

    html2pdf(element, {
      margin: 5,
      filename: `Daily Statistics Record - ${format(
        new Date(),
        "MM-dd-yy"
      )}.pdf`,
      jsPDF: { format: "letter", orientation },
      html2canvas: { scale: 2 },
    });
  };

  const handleDownload = (orientation: string) => {
    if (!isLocked) {
      handleClick(orientation);
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex fleco items-center gap-2">
        <Button onClick={() => handleDownload("landscape")}>
          Download Landscape
        </Button>
        <Button onClick={() => handleDownload("portrait")}>
          Download Portrait
        </Button>
      </div>
      <div id="tally-table" className="w-full flex flex-col items-center gap-4">
        <div className="flex text-center font-medium flex-col items-center gap-4">
          <div className="font-normal text-sm">
            <p>The Library</p>
            <p>General de Jesus College</p>
            <p>San Isidro, Nueva Ecija</p>
          </div>

          <p>Daily Statistics Record</p>
          <p>Date: {format(new Date(date), "MMMM dd, yyyy")}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-black dark:text-white text-center border-b border border-black dark:border-white">
                Time
              </TableHead>
              <TableHead className="text-center text-black dark:text-white  border-b border border-black dark:border-white">
                Faculty
              </TableHead>
              <TableHead className="text-center text-black dark:text-white  border-b border border-black dark:border-white">
                Highschool
              </TableHead>
              <TableHead className="text-center text-black dark:text-white  border-b border border-black dark:border-white">
                No. of College Students
              </TableHead>
              <TableHead className="text-center text-black dark:text-white  border-b border border-black dark:border-white">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map((time, index) => {
              const counts = attendanceLogs.reduce(
                (acc, log) => {
                  const timeInDate = new Date(log.time_in_date);
                  const hour = timeInDate.getHours();
                  const slot = getTimeSlot(hour);

                  if (slot === time) {
                    if (log.classification === "College") acc.college += 1;
                    if (log.classification === "HS") acc.highschool += 1;
                    if (log.classification === "Faculty") acc.faculty += 1;
                  }

                  return acc;
                },
                { college: 0, highschool: 0, faculty: 0 }
              );

              return (
                <React.Fragment key={index}>
                  <TableRowComponent time={time} counts={counts} />
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>

        <p className="w-full font-medium text-right mr-14 ">
          Total: {attendanceLogs?.length}
        </p>
      </div>
    </>
  );
};

type TableRowProps = {
  time?: string;
  counts: {
    college?: number;
    highschool?: number;
    faculty?: number;
  };
};

const TableRowComponent = ({ time, counts }: TableRowProps) => {
  const { college = 0, faculty = 0, highschool = 0 } = counts;
  const total = college + faculty + highschool;

  const renderTallies = (count: number = 0) => {
    const tallies = Math.floor(count / 5);
    const remainder = count % 5;
    let tallyMarks = [];

    for (let i = 0; i < tallies; i++) {
      tallyMarks.push(
        <div key={i} className="relative mx-auto flex items-center gap-1">
          <div className="w-px h-4 bg-black dark:bg-white"></div>
          <div className="w-px h-4 bg-black dark:bg-white"></div>
          <div className="w-px h-4 bg-black dark:bg-white"></div>
          <div className="w-px h-4 bg-black dark:bg-white"></div>
          <div className="w-px h-5 bg-black dark:bg-white rotate-45 absolute right-2 z-10"></div>
        </div>
      );
    }

    for (let j = 0; j < remainder; j++) {
      tallyMarks.push(
        <div key={tallies + j} className="mx-auto flex items-center">
          <div className="w-px h-4 bg-black dark:bg-white"></div>
        </div>
      );
    }

    return tallyMarks;
  };

  return (
    <TableRow className="">
      <TableCell className="py-2 border-b border border-black dark:border-white text-center">
        {time}
      </TableCell>
      <TableCell className="w-[200px] py-2 border-b border border-black dark:border-white">
        <div className="w-fit flex items-center gap-2">
          {renderTallies(faculty)}
        </div>
      </TableCell>
      <TableCell className="w-[200px] py-2 border-b border border-black dark:border-white">
        <div className="w-fit flex items-center gap-2">
          {renderTallies(highschool)}
        </div>
      </TableCell>
      <TableCell className="py-2 border-b border border-black dark:border-white">
        <div className="w-fit flex items-center gap-2">
          {renderTallies(college)}
        </div>
      </TableCell>
      <TableCell className="w-[100px] py-2 border-b border border-black dark:border-white text-center">
        {total > 0 && total}
      </TableCell>
    </TableRow>
  );
};

export default DailyStatsRecord2;
