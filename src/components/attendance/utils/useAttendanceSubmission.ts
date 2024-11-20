import { useState, useEffect } from "react";
import { WebSocketService } from "@/utils/websocketService";
import { Attendance } from "@/types/attendanceform";
import { env } from "@/env";

interface WebSocketMessage {
  type: string;
  action: string;
  attendance: Attendance;
}

export const useAttendanceSubmission = (studentId: string) => {
  const [submissionData, setSubmissionData] = useState<Attendance | null>(null);
  const [baggageNumber, setBaggageNumber] = useState<number | null>(null);
  const [websocketService, setWebsocketService] =
    useState<WebSocketService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");

  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    // Create WebSocket instance
    const ws = new WebSocketService(`${WS_URL}/ws/attendance/`);
    setWebsocketService(ws);

    // Define message handler
    const handleMessage = (data: WebSocketMessage) => {
      if (
        data.type === "notify_clients" &&
        data.action === "created" &&
        data.attendance.school_id === studentId
      ) {
        setBaggageNumber(data.attendance.baggage_number || null);
        setSubmissionData(data.attendance);
      }
    };

    // Add message handler to WebSocket service
    ws.addMessageHandler(handleMessage);

    // Add a message handler specifically for connection status
    ws.addMessageHandler((data) => {
      if (data.type === "connection_status") {
        setConnectionStatus(data.status);
      }
    });

    // Cleanup function
    return () => {
      ws.removeMessageHandler(handleMessage);
      ws.disconnect();
      setWebsocketService(null);
    };
  }, [studentId, WS_URL]);

  const resetSubmissionData = () => {
    setSubmissionData(null);
    setBaggageNumber(null);
  };

  const sendMessage = (message: any) => {
    websocketService?.sendMessage(message);
  };

  return {
    submissionData,
    baggageNumber,
    connectionStatus,
    resetSubmissionData,
    sendMessage,
  };
};
