"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WebSocketService } from "@/utils/websocketService";
import { env } from "@/env";

interface Attendance {
  id: string;
  school_id: string;
  current_avatar: string | null;
  first_name: string;
  middle_name?: string;
  last_name: string;
  course?: string;
  year_level?: string;
  purpose: string;
  status: string;
  date?: string;
  time_in_date?: string;
  time_out_date?: string;
  classification?: string;
  has_already_timed_in: boolean;
  has_already_timed_out: boolean;
  baggage_number?: number;
  baggage_returned: boolean;
}

interface WebSocketMessage {
  action: "created" | "updated" | "deleted";
  attendance: Attendance;
  baggage_update?: {
    number: number;
    is_available: boolean;
  };
}

export default function BaggageCards() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleRecords, setVisibleRecords] = useState<Attendance[]>([]);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [websocketService, setWebsocketService] =
    useState<WebSocketService | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    const initializeWebSocket = () => {
      const ws = new WebSocketService(`${WS_URL}/ws/attendance/`);

      const handleMessage = (data: WebSocketMessage) => {
        if (!data.attendance) return;

        setRecords((prevRecords) => {
          let newRecords: Attendance[];

          switch (data.action) {
            case "created": {
              // Only add records with baggage numbers that aren't returned
              if (
                data.attendance.baggage_number &&
                !data.attendance.baggage_returned
              ) {
                const exists = prevRecords.some(
                  (record) => record.id === data.attendance.id
                );
                if (exists) return prevRecords;
                newRecords = [data.attendance, ...prevRecords];
              } else {
                return prevRecords;
              }
              break;
            }
            case "updated": {
              newRecords = prevRecords
                .map((record) => {
                  if (record.id === data.attendance.id) {
                    // If baggage is now returned, filter it out
                    if (data.attendance.baggage_returned) {
                      return null;
                    }
                    return data.attendance;
                  }
                  return record;
                })
                .filter((record): record is Attendance => record !== null);
              break;
            }
            case "deleted":
              newRecords = prevRecords.filter(
                (record) => record.id !== data.attendance.id
              );
              break;
            default:
              return prevRecords;
          }

          // Sort by baggage number
          return newRecords.sort(
            (a, b) => (a.baggage_number || 0) - (b.baggage_number || 0)
          );
        });
      };

      ws.addMessageHandler(handleMessage);
      setWebsocketService(ws);

      return () => {
        ws.removeMessageHandler(handleMessage);
        ws.disconnect();
      };
    };

    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/v2/attendance`);
        const data = await response.json();

        if (!Array.isArray(data)) {
          console.error("Expected array of records but got:", typeof data);
          setRecords([]);
          return;
        }

        // Filter for only active baggage records and sort by baggage number
        const filteredRecords = data
          .filter(
            (record: Attendance) =>
              record.baggage_number && !record.baggage_returned
          )
          .sort(
            (a: Attendance, b: Attendance) =>
              (a.baggage_number || 0) - (b.baggage_number || 0)
          );

        setRecords(filteredRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeWebSocket();
    fetchRecords();

    return cleanup;
  }, [API_URL, WS_URL]);

  useEffect(() => {
    const updateVisibleRecords = (): void => {
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const cardWidth = 180; // Width of each card (160px) + gap (20px)
      const cardsPerView = Math.max(2, Math.floor(containerWidth / cardWidth));
      setVisibleRecords(records.slice(startIndex, startIndex + cardsPerView));
    };

    updateVisibleRecords();
    window.addEventListener("resize", updateVisibleRecords);
    return () => window.removeEventListener("resize", updateVisibleRecords);
  }, [startIndex, records]);

  const loadMoreRecords = (): void => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, records.length - visibleRecords.length)
    );
  };

  const loadPreviousRecords = (): void => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + visibleRecords.length < records.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full relative">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-200">
        <div className="flex space-x-5 p-4">
          {visibleRecords.map((record) => (
            <div
              key={record.id}
              className="relative flex-shrink-0 w-[140px] sm:w-[160px] h-[210px] sm:h-[240px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-100"
            >
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
                  {record.first_name} {record.middle_name} {record.last_name}
                </p>
              </div>
            </div>
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
