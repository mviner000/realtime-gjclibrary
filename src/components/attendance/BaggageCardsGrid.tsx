"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAttendanceData } from "./utils/useAttendanceData";
import ConfirmationDialog from "./ConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { env } from "@/env";

export default function BaggageCardsGrid() {
  const { records: unreturnedRecords, isLoading } = useAttendanceData(true);
  const { records: allRecords } = useAttendanceData(false);
  const [updatingBaggage, setUpdatingBaggage] = useState<string | null>(null);
  const { toast } = useToast();

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Sort unreturned records by latest time_in
  const sortedUnreturnedRecords = [...unreturnedRecords].sort((a, b) => {
    const aTime = new Date(a.time_in_date || 0).getTime();
    const bTime = new Date(b.time_in_date || 0).getTime();
    return bTime - aTime;
  });

  const recordsWithBaggage = allRecords
    .filter((record) => record.baggage_number !== null)
    .sort((a, b) => {
      const aTime = new Date(a.time_in_date || 0).getTime();
      const bTime = new Date(b.time_in_date || 0).getTime();
      return bTime - aTime;
    });

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

  const StaticBaggageCard = () => (
    <div className="relative flex-shrink-0 w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200">
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {allBaggageReturned && <StaticBaggageCard />}
      {sortedUnreturnedRecords.map((record) => (
        <ConfirmationDialog
          key={record.id}
          trigger={
            <div className="border-2 border-yellow-400 relative flex-shrink-0 w-full h-[300px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-100 mx-auto">
              <div className="absolute top-4 left-4">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white ring-2 ring-gray-200">
                  <AvatarImage
                    src={record.current_avatar || "/images/def-avatar.svg"}
                    alt={record.first_name}
                  />
                  <AvatarFallback>{record.first_name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute top-4 left-20 font-bold dark:text-black">
                <p>{record.first_name}</p>
                <p>{record.last_name}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-green-600 text-5xl sm:text-8xl font-bold">
                  {record.baggage_number}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="dark:text-black text-lg font-bold truncate text-center">
                  {record.course} {record.year_level}
                  <p>{record.classification}</p>
                </p>
              </div>
            </div>
          }
          title="Mark Baggage as Returned"
          description={`Are you sure you want to mark baggage #${record.baggage_number} as returned for ${record.first_name} ${record.last_name}?`}
          confirmText="Return"
          onConfirm={() => handleBaggageUpdate(record)}
          isLoading={updatingBaggage === record.id}
        />
      ))}
    </div>
  );
}
