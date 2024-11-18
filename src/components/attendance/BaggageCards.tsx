"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft, Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAttendanceData } from "./useAttendanceData";
import ConfirmationDialog from "./ConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { env } from "@/env";

export default function BaggageCards() {
  const { records: unreturnedRecords, isLoading } = useAttendanceData(true);
  const { records: allRecords } = useAttendanceData(false);
  const [visibleRecords, setVisibleRecords] = useState(unreturnedRecords);
  const [startIndex, setStartIndex] = useState(0);
  const [updatingBaggage, setUpdatingBaggage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Get all records with baggage for today
  const recordsWithBaggage = allRecords.filter(
    (record) => record.baggage_number !== null
  );

  // Show "all returned" card only when there are baggage records for today but none are unreturned
  const allBaggageReturned =
    recordsWithBaggage.length > 0 && unreturnedRecords.length === 0;

  const formatDate = () => {
    const date = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = days[date.getDay()];
    return `${day} - ${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
  };

  const handleBaggageUpdate = async (record: any) => {
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

  useEffect(() => {
    const updateVisibleRecords = (): void => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const cardWidth = 180; // Width of each card (160px) + gap (20px)
      const cardsPerView = Math.max(2, Math.floor(containerWidth / cardWidth));
      setVisibleRecords(
        unreturnedRecords.slice(startIndex, startIndex + cardsPerView)
      );
    };

    updateVisibleRecords();
    window.addEventListener("resize", updateVisibleRecords);
    return () => window.removeEventListener("resize", updateVisibleRecords);
  }, [startIndex, unreturnedRecords]);

  const loadMoreRecords = (): void => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, unreturnedRecords.length - visibleRecords.length)
    );
  };

  const loadPreviousRecords = (): void => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const showLeftArrow = startIndex > 0;
  const showRightArrow =
    startIndex + visibleRecords.length < unreturnedRecords.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const StaticBaggageCard = () => (
    <div className="relative flex-shrink-0 w-[140px] sm:w-[160px] h-[210px] sm:h-[240px] rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200">
      <div className="absolute top-4 left-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="text-lg font-bold text-gray-700 text-center">
          All Baggage
        </span>
        <span className="text-sm text-gray-500 text-center mt-2">
          {formatDate()}
        </span>
        <span className="text-xs text-green-600 font-medium mt-2">
          Has Returned
        </span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full relative">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-200">
        <div className="flex space-x-5 p-4">
          {allBaggageReturned && <StaticBaggageCard />}
          {unreturnedRecords.map((record) => (
            <ConfirmationDialog
              key={record.id}
              trigger={
                <div className="relative flex-shrink-0 w-[140px] sm:w-[160px] h-[210px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-100">
                  <div className="absolute top-4 left-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white ring-2 ring-gray-200">
                      <AvatarImage
                        src={record.current_avatar || "/images/def-avatar.svg"}
                        alt={record.first_name}
                      />
                      <AvatarFallback>{record.first_name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl font-bold text-gray-300">
                      {record.baggage_number}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-black text-xs sm:text-sm font-medium truncate">
                      {record.first_name} {record.middle_name}{" "}
                      {record.last_name}
                    </p>
                  </div>
                </div>
              }
              title="Mark Baggage as Returned"
              description={`Are you sure you want to mark baggage #${record.baggage_number} as returned for ${record.first_name} ${record.last_name}?`}
              confirmText="Mark as Returned"
              onConfirm={() => handleBaggageUpdate(record)}
              isLoading={updatingBaggage === record.id}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {showLeftArrow && (
        <div className="absolute top-1/2 left-2 -translate-y-1/2">
          <Button
            onClick={loadPreviousRecords}
            className="rounded-full bg-white hover:bg-gray-100 text-gray-600"
            variant="outline"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Show Previous</span>
          </Button>
        </div>
      )}
      {showRightArrow && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Button
            onClick={loadMoreRecords}
            className="rounded-full bg-white hover:bg-gray-100 text-gray-600"
            variant="outline"
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Show More</span>
          </Button>
        </div>
      )}
    </div>
  );
}
