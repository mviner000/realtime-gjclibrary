"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WebSocketService } from "@/utils/websocketService";
import { env } from "@/env";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

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
  baggage_update?: {
    number: number;
    is_available: boolean;
  };
}

export default function AttendanceViewer() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBaggage, setUpdatingBaggage] = useState<string | null>(null);
  const [websocketService, setWebsocketService] =
    useState<WebSocketService | null>(null);
  const { toast } = useToast();

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

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

    const cleanup = initializeWebSocket();
    fetchRecords();

    return () => {
      cleanup();
    };
  }, [API_URL, WS_URL]);

  return (
    <div className="space-y-4 p-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1">
          {records.map((record) => (
            <Card key={`viewer-${record.id}`} className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Student Information
                  </h3>
                  <p className="text-sm">
                    <span className="font-medium">ID:</span> {record.school_id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {record.first_name} {record.middle_name} {record.last_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Course:</span>{" "}
                    {record.course || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Year Level:</span>{" "}
                    {record.year_level || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Visit Details</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Purpose:</span>{" "}
                      {record.purpose}
                    </p>
                    {/* <p className="text-sm">
                    <span className="font-medium">Status:</span>{" "}
                    <Badge
                      variant={
                        record.status === "time_out" ? "secondary" : "default"
                      }
                    >
                      {record.status}
                    </Badge>
                  </p> */}
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
                    {record.time_out_date && (
                      <p className="text-sm">
                        <span className="font-medium">Time Out:</span>{" "}
                        {new Date(record.time_out_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {record.baggage_number !== null && (
                <div className="mt-4 p-3 bg-secondary rounded-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Baggage Information
                      </h3>
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
                          {record.baggage_returned
                            ? "Returned"
                            : "Not Returned"}
                        </Badge>
                      </p>
                    </div>
                    <Button
                      variant={record.baggage_returned ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleBaggageUpdate(record)}
                      disabled={updatingBaggage === record.id}
                      className="mt-2 sm:mt-0"
                    >
                      {updatingBaggage === record.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : record.baggage_returned ? (
                        "Mark as Not Returned"
                      ) : (
                        "Mark as Returned"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}
