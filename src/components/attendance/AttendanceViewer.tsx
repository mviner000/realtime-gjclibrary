"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { WebSocketService } from "@/utils/websocketService";

interface Attendance {
  id: string;
  school_id: string;
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
}

export default function AttendanceViewer() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websocketService, setWebsocketService] =
    useState<WebSocketService | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    const initializeWebSocket = () => {
      const ws = new WebSocketService(`${WS_URL}/ws/attendance/`);

      const handleMessage = (data: WebSocketMessage) => {
        if (!data.attendance) return;

        setRecords((prevRecords) => {
          switch (data.action) {
            case "created": {
              const exists = prevRecords.some(
                (record) => record.id === data.attendance.id
              );
              if (exists) return prevRecords;
              return [data.attendance, ...prevRecords];
            }

            case "updated": {
              const recordExists = prevRecords.some(
                (record) => record.id === data.attendance.id
              );
              if (!recordExists) return prevRecords;
              return prevRecords.map((record) =>
                record.id === data.attendance.id ? data.attendance : record
              );
            }

            case "deleted":
              return prevRecords.filter(
                (record) => record.id !== data.attendance.id
              );

            default:
              return prevRecords;
          }
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

        const sortedRecords = [...data].sort((a: Attendance, b: Attendance) => {
          const aDate = new Date(a.time_in_date || a.date || 0);
          const bDate = new Date(b.time_in_date || b.date || 0);
          return bDate.getTime() - aDate.getTime();
        });

        setRecords(sortedRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize WebSocket and fetch initial records
    const cleanup = initializeWebSocket();
    fetchRecords();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [API_URL, WS_URL]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={`viewer-${record.id}`} className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Student Information</h3>
                  <p>ID: {record.school_id}</p>
                  <p>
                    Name: {record.first_name} {record.middle_name}{" "}
                    {record.last_name}
                  </p>
                  <p>Course: {record.course || "N/A"}</p>
                  <p>Year Level: {record.year_level || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Visit Details</h3>
                  <p>Purpose: {record.purpose}</p>
                  <p>Status: {record.status}</p>
                  <p>Classification: {record.classification || "N/A"}</p>
                  <p>
                    Time In:{" "}
                    {record.time_in_date
                      ? new Date(record.time_in_date).toLocaleString()
                      : "N/A"}
                  </p>
                  {record.time_out_date && (
                    <p>
                      Time Out:{" "}
                      {new Date(record.time_out_date).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              {record.baggage_number !== null && (
                <div className="mt-4 p-2 bg-gray-50 dark:text-black dark:bg-gray-400 rounded">
                  <h3 className="font-semibold">Baggage Information</h3>
                  <p>Number: {record.baggage_number}</p>
                  <p>
                    Status:{" "}
                    {record.baggage_returned ? "Returned" : "Not Returned"}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
