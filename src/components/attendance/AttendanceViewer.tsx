"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { WebSocketService } from "@/utils/websocketService";
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

  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderAccordionItem = (record: Attendance) => (
    <div className="mt-5" key={record.id}>
      <AccordionItem value={record.id} className="border-none">
        <Card className="overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex justify-between items-center w-full text-left">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={record.current_avatar || "/images/def-avatar.svg"}
                    alt={record.first_name}
                  />
                  <AvatarFallback>
                    {record.first_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold">{`${record.first_name} ${record.last_name}`}</h3>
                  <p className="text-sm text-muted-foreground">
                    {record.course} - {record.year_level}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm">{record.purpose}</p>
                  <p className="text-sm text-muted-foreground">
                    Time In: {formatTime(record.time_in_date)}
                  </p>
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
                    <Button
                      variant="default"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleBaggageUpdate(record)}
                      disabled={updatingBaggage === record.id}
                    >
                      {updatingBaggage === record.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        "Mark as Returned"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="not-returned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="not-returned">Not Returned</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
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
        </Tabs>
      )}
      <Toaster />
    </div>
  );
}
