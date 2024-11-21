"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUpSquareIcon, Clock, Loader2 } from "lucide-react";
import { env } from "@/env";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/custom-accordion";
import { useAttendanceData, type Attendance } from "./utils/useAttendanceData";
import ConfirmationDialog from "./ConfirmationDialog";
import Image from "next/image";

const purposeIcons = [
  {
    icon: "/images/purposes/research.png",
    label: "Research",
    value: "research",
  },
  {
    icon: "/images/purposes/clearance.png",
    label: "Clearance",
    value: "clearance",
  },
  {
    icon: "/images/purposes/orientation_or_meeting.png",
    label: "Orientation/Meeting",
    value: "orientation_or_meeting",
  },
  {
    icon: "/images/purposes/transaction.png",
    label: "Transaction",
    value: "transaction",
  },
  {
    icon: "/images/purposes/silver_star.png",
    label: "Silver Star",
    value: "silver_star",
  },
  {
    icon: "/images/purposes/reading_study_or_review.png",
    label: "Reading/Study/Review",
    value: "reading_study_or_review",
  },
  { icon: "/images/purposes/xerox.png", label: "Xerox", value: "xerox" },
  { icon: "/images/purposes/print.png", label: "Print", value: "print" },
  {
    icon: "/images/purposes/computer_use.png",
    label: "Computer Use",
    value: "computer_use",
  },
];

const courseAbbreviations: { [key: string]: string } = {
  "Accountancy, Business and Management (ABM)": "SHS: ABM",
  "Science, Technology, Engineering and Mathematics": "SHS: STEM",
  "Humanities and Social Sciences": "SHS: HUMMS",
  "General Academic Strand": "SHS: GAS",
};

export default function AttendanceViewer() {
  const { records, isLoading } = useAttendanceData(false);
  const [updatingBaggage, setUpdatingBaggage] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeAttendanceTab") || "not-returned";
    }
    return "not-returned";
  });

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeAttendanceTab", activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleBaggageUpdate = async (record: Attendance) => {
    if (!record.baggage_number) return;

    try {
      setUpdatingBaggage(record.id);

      const response = await fetch(`${API_URL}/v2/attendance/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...record,
          baggage_returned: !record.baggage_returned,
          status: "time_out",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update baggage status");
      }

      toast({
        title: "Success",
        description: "Baggage status updated successfully",
      });
    } catch (error) {
      console.error("Error updating baggage status:", error);
      toast({
        title: "Error",
        description: "Failed to update baggage status",
        variant: "destructive",
      });
    } finally {
      setUpdatingBaggage(null);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getCourseAbbreviation = (course: string | undefined): string => {
    if (!course) return "N/A";
    return courseAbbreviations[course] || course;
  };

  const renderAccordionItem = (record: Attendance) => {
    const purposeIcon = purposeIcons.find((p) => p.value === record.purpose);

    return (
      <div className="mt-5" key={record.id}>
        <AccordionItem value={record.id} className="border-none">
          <Card className="overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex justify-between items-center w-full text-left">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={record.current_avatar || "/images/def-avatar.svg"}
                      alt={record.first_name}
                    />
                    <AvatarFallback>
                      {record.first_name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold md:hidden">
                      {record.first_name}
                    </h3>
                    <h3 className="font-semibold hidden md:block">
                      {`${record.first_name} ${record.last_name}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {record.course && record.year_level
                        ? `${getCourseAbbreviation(record.course)} - ${record.year_level}`
                        : "Faculty"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {purposeIcon && (
                        <Image
                          src={purposeIcon.icon}
                          alt={purposeIcon.label}
                          width={24}
                          height={24}
                          className="md:hidden"
                        />
                      )}
                      <p className="text-sm hidden md:block">
                        {record.purpose}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground sm:block hidden">
                      Time In: {formatTime(record.time_in_date)}
                    </p>
                    <div className="sm:hidden items-center">
                      <span className="text-xs">
                        {formatTime(record.time_in_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Student Information</h4>
                    <p className="text-sm">
                      <span className="font-medium">ID:</span>{" "}
                      {record.school_id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {record.first_name} {record.middle_name}{" "}
                      {record.last_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Course:</span>{" "}
                      {getCourseAbbreviation(record.course)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Year Level:</span>{" "}
                      {record.year_level || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Visit Details</h4>
                    <p className="text-sm">
                      <span className="font-medium">Purpose:</span>{" "}
                      {record.purpose}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Classification:</span>{" "}
                      <Badge variant="outline">
                        {record.classification || "N/A"}
                      </Badge>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time In:</span>{" "}
                      {record.time_in_date
                        ? new Date(record.time_in_date).toLocaleString()
                        : "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time Out:</span>{" "}
                      {record.time_out_date
                        ? new Date(record.time_out_date).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {record.baggage_number !== undefined && (
                  <div className="bg-secondary p-4 rounded-md">
                    <h4 className="font-semibold mb-2">Baggage Information</h4>
                    <p className="text-sm">
                      <span className="font-medium">Number:</span>{" "}
                      {record.baggage_number}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <Badge
                        variant={
                          record.baggage_returned ? "default" : "destructive"
                        }
                      >
                        {record.baggage_returned ? "Returned" : "Not Returned"}
                      </Badge>
                    </p>
                    {!record.baggage_returned && (
                      <ConfirmationDialog
                        trigger={
                          <Button variant="default" size="sm" className="mt-2">
                            {updatingBaggage === record.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              "Mark as Returned"
                            )}
                          </Button>
                        }
                        title="Confirm Baggage Return"
                        description="Are you sure you want to mark this baggage as returned? This action cannot be undone."
                        confirmText="Return"
                        onConfirm={() => handleBaggageUpdate(record)}
                        isLoading={updatingBaggage === record.id}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold my-4">Live Feed</h2>
        <Button
          variant="ghost"
          className="border border-gray-300 md:flex hidden"
          onClick={() => {
            toast({
              title: "Beta Feature",
              description: "This feature is currently in beta mode.",
            });
          }}
        >
          <ChevronUpSquareIcon className="mr-1" />
          Return All Baggages
        </Button>
        <Button
          variant="ghost"
          className="border border-gray-300 md:hidden"
          onClick={() => {
            toast({
              title: "Beta Feature",
              description: "This feature is currently in beta mode.",
            });
          }}
        >
          <ChevronUpSquareIcon className="w-6 h-6" />
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="not-returned">Not Returned</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
            <TabsTrigger value="all">All Baggages</TabsTrigger>
          </TabsList>
          <TabsContent value="not-returned">
            <Accordion type="single" collapsible className="space-y-4">
              {records
                .filter(
                  (record) =>
                    record.baggage_number !== null && !record.baggage_returned
                )
                .map(renderAccordionItem)}
            </Accordion>
          </TabsContent>
          <TabsContent value="returned">
            <Accordion type="single" collapsible className="space-y-4">
              {records
                .filter(
                  (record) =>
                    record.baggage_number !== null && record.baggage_returned
                )
                .map(renderAccordionItem)}
            </Accordion>
          </TabsContent>
          <TabsContent value="all">
            <Accordion type="single" collapsible className="space-y-4">
              {records
                .filter((record) => record.baggage_number !== null)
                .map(renderAccordionItem)}
            </Accordion>
          </TabsContent>
        </Tabs>
      )}
      <Toaster />
    </div>
  );
}
