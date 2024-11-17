"use client";

import { useState, useEffect, useRef } from "react";
import { Attendance, WebSocketMessage } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AttendanceViewer() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isComponentMounted = useRef(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    isComponentMounted.current = true;
    fetchRecords(currentPage);
    setupWebSocket();

    return () => {
      isComponentMounted.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [currentPage]);

  const fetchRecords = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v2/attendance?page=${page}`);
      const data = await response.json();

      if (isComponentMounted.current) {
        // Sort records by the latest time_in_date
        const sortedRecords = data.items.sort(
          (a: Attendance, b: Attendance) => {
            const aDate = new Date(a.time_in_date || a.date);
            const bDate = new Date(b.time_in_date || b.date);
            return bDate.getTime() - aDate.getTime();
          }
        );

        setRecords(sortedRecords);
        setTotalPages(Math.ceil(data.total / 20));
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocket = () => {
    if (!isComponentMounted.current) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}/ws/attendance/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted.current) return;

      const data = JSON.parse(event.data) as WebSocketMessage;
      if (!data.attendance) return;

      switch (data.action) {
        case "created":
          if (currentPage === 1) {
            setRecords((prevRecords) => {
              const exists = prevRecords.some(
                (record) => record.id === data.attendance?.id
              );
              if (exists) return prevRecords;
              return [data.attendance!, ...prevRecords.slice(0, 19)];
            });
          }
          break;

        case "updated":
          setRecords((prevRecords) => {
            const recordExists = prevRecords.some(
              (record) => record.id === data.attendance?.id
            );
            if (!recordExists) return prevRecords;
            return prevRecords.map((record) =>
              record.id === data.attendance?.id ? data.attendance! : record
            );
          });
          break;

        case "deleted":
          setRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== data.attendance?.id)
          );
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null;

      if (isComponentMounted.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          setupWebSocket();
        }, 3000);
      }
    };
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
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
                  <div className="mt-4 p-2 bg-gray-50 rounded">
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

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
