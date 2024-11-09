"use client";

import { useState, useEffect, Suspense } from "react";
import { PieGraph } from "@/components/charts/pie-graph";
import { VisitorsByCourse } from "@/components/charts/visitor-by-course";
import { DownloadReport } from "@/components/dashboard/DownloadReport";
import PageContainer from "@/components/layout/page-container";
import { RecentVisitors } from "@/components/recent-visitors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComboboxPopoverForDateWeeklySelection } from "./ComboboxPopoverForDateWeeklySelection";
import { LucideIcon } from "lucide-react";
import { DailyPieGraph } from "../charts/daily-pie-graph";
import { DailyVisitorsByCourse } from "../charts/daily-visitor-by-course";
import BookTransactionsList from "../card/LibraryCardDashboard/BookTransactionsList";
import BookTransactionsSkeletonLoader from "../card/LibraryCardDashboard/BookTransactionsSkeletonLoader";
import dynamic from "next/dynamic";
import AttendanceFor from "./AttendanceFor";

const BookTransactionsAccordion = dynamic(
  () => import("../card/LibraryCardDashboard/BookTransactionsAccordion"),
  {
    loading: () => <BookTransactionsSkeletonLoader />,
    ssr: false, // Disable server-side rendering for this component
  }
);

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export function DashReloader() {
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  const [selectedTab, setSelectedTab] = useState("pie-graph");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<Status | null>(
    null
  );

  useEffect(() => {
    // Load the selected tab and time frame from localStorage
    const savedTab = localStorage.getItem("selectedVisitorTab");
    const savedTimeFrame = localStorage.getItem("selectedTimeFrame");
    if (savedTab) {
      setSelectedTab(savedTab);
    }
    if (savedTimeFrame) {
      setSelectedTimeFrame(JSON.parse(savedTimeFrame));
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown - 1 === 0) {
          window.location.reload();
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    localStorage.setItem("selectedVisitorTab", value);
  };

  const handleStatusChange = (status: Status | null) => {
    setSelectedTimeFrame(status);
    localStorage.setItem("selectedTimeFrame", JSON.stringify(status));
  };

  const isWeekly = selectedTimeFrame?.value === "weekly";

  return (
    <PageContainer scrollable={true}>
      <div>
        <p>Page will reload in {countdown} seconds.</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <DownloadReport />
          </div>
        </div>
        {/* <ComboboxPopoverForDateWeeklySelection
          onStatusChange={handleStatusChange}
        /> */}
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          {/* <TabsList>
            <TabsTrigger value="pie-graph">PieGraph</TabsTrigger>
            <TabsTrigger value="listed">Listed</TabsTrigger>
          </TabsList> */}
          <TabsContent value="pie-graph" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 md:col-span-4">
                <AttendanceFor />
              </div>
              {/* <div className="col-span-4 md:col-span-3">
                {isWeekly ? <PieGraph /> : <DailyPieGraph />}
              </div> */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Visitors</CardTitle>
                  <CardDescription>
                    last 10 persons visited the school library today
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <RecentVisitors />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="listed" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 md:col-span-3">
                {isWeekly ? <VisitorsByCourse /> : <DailyVisitorsByCourse />}
              </div>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Visitors</CardTitle>
                  <CardDescription>
                    last 10 persons visited the school library today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentVisitors />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
