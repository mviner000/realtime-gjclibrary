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

const DailyStatsRecord = () => {
  const setIsPinModalOpen = useGlobalStore((state) => state.setIsPinModalOpen);

  const handleClick = async (orientation: string) => {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#tally-table");

    html2pdf(element, {
      margin: 5,
      filename: `Daily Statistics Record - ${format(
        new Date(),
        "MM-dd-yy"
      )}.pdf`,
      jsPDF: { format: "A4", orientation },
    });
  };

  const handleDownload = (orientation: string) => {
    const isUnlocked = Cookie.get("unlocked-pin-timer");
    if (isUnlocked) {
      handleClick(orientation);
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
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
          <p>Date: {format(new Date(), "MMMM dd, yyyy")}</p>
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
            {timeSlots.map((time, index) => (
              <React.Fragment key={index}>
                <TableRowComponent time={time} />
                {/* <TableRowComponent /> */}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

type TableRowProps = {
  time?: string;
};

const TableRowComponent = ({ time }: TableRowProps) => {
  const [count] = useState(11);

  const renderTallies = () => {
    const tallies = Math.floor(count / 5);
    const remainder = count % 5;
    let tallyMarks = [];

    for (let i = 0; i < tallies; i++) {
      tallyMarks.push(
        <div key={i} className="relative mx-auto flex items-center gap-1">
          <div className="w-px h-5 bg-black dark:bg-white"></div>
          <div className="w-px h-5 bg-black dark:bg-white"></div>
          <div className="w-px h-5 bg-black dark:bg-white"></div>
          <div className="w-px h-5 bg-black dark:bg-white"></div>
          <div className="w-px h-6 bg-black dark:bg-white rotate-45 absolute right-2 z-10"></div>
        </div>
      );
    }

    for (let j = 0; j < remainder; j++) {
      tallyMarks.push(
        <div key={tallies + j} className="mx-auto flex items-center">
          <div className="w-px h-5 bg-black dark:bg-white"></div>
        </div>
      );
    }

    return tallyMarks;
  };

  return (
    <TableRow className="h-[51px]">
      <TableCell className="border-b border border-black dark:border-white text-center">
        {time}
      </TableCell>
      <TableCell className="border-b border border-black dark:border-white"></TableCell>
      <TableCell className="border-b border border-black dark:border-white"></TableCell>
      <TableCell className="border-b border border-black dark:border-white">
        <div className="w-fit flex items-center gap-3">{renderTallies()}</div>
      </TableCell>
      <TableCell className="border-b border border-black dark:border-white">6</TableCell>
    </TableRow>
  );
};

export default DailyStatsRecord;
