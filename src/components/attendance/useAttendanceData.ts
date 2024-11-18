import { useState, useEffect } from "react";
import { WebSocketService } from "@/utils/websocketService";
import { env } from "@/env";

export interface Attendance {
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

export const useAttendanceData = (filterBaggageOnly: boolean = false) => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websocketService, setWebsocketService] =
    useState<WebSocketService | null>(null);

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
              if (filterBaggageOnly) {
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
              } else {
                const exists = prevRecords.some(
                  (record) => record.id === data.attendance.id
                );
                if (exists) return prevRecords;
                return [data.attendance, ...prevRecords];
              }
              break;
            }
            case "updated": {
              if (filterBaggageOnly) {
                newRecords = prevRecords
                  .map((record) => {
                    if (record.id === data.attendance.id) {
                      if (data.attendance.baggage_returned) return null;
                      return data.attendance;
                    }
                    return record;
                  })
                  .filter((record): record is Attendance => record !== null);
              } else {
                return prevRecords.map((record) =>
                  record.id === data.attendance.id ? data.attendance : record
                );
              }
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

          if (filterBaggageOnly) {
            return newRecords.sort(
              (a, b) => (a.baggage_number || 0) - (b.baggage_number || 0)
            );
          }
          return newRecords;
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

        let processedRecords = data;

        if (filterBaggageOnly) {
          processedRecords = data
            .filter(
              (record: Attendance) =>
                record.baggage_number && !record.baggage_returned
            )
            .sort(
              (a: Attendance, b: Attendance) =>
                (a.baggage_number || 0) - (b.baggage_number || 0)
            );
        } else {
          processedRecords = [...data].sort((a: Attendance, b: Attendance) => {
            const aDate = new Date(a.time_in_date || a.date || 0);
            const bDate = new Date(b.time_in_date || b.date || 0);
            return bDate.getTime() - aDate.getTime();
          });
        }

        setRecords(processedRecords);
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
  }, [API_URL, WS_URL, filterBaggageOnly]);

  return { records, isLoading, websocketService };
};
