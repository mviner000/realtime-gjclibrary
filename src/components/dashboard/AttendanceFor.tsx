"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface AttendanceRecord {
  id: string;
  baggage_number: number | null;
  baggage_returned: boolean;
  school_id: string;
  full_name: string;
  time_in_date: string;
  current_avatar: string;
  attendance_count: number;
  time_out_date?: string;
}

export default function AttendanceFor() {
  const [date, setDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingTimeOut, setProcessingTimeOut] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAttendance = async (selectedDate: Date) => {
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(`/api/attendance-for/${formattedDate}`);
      const data = await response.json();
      
      if (response.ok) {
        const activeRecords = Array.isArray(data) 
          ? data.filter(record => !record.time_out_date)
          : [];
        setAttendance(activeRecords);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch attendance records"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error loading attendance records"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimeOut = async (attendanceId: string) => {
    setProcessingTimeOut(attendanceId);

    const requestBody = {
      attendance_id: attendanceId,
    };

    try {
      const response = await fetch('/api/attendance/time-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Successfully returned"
        });
        setAttendance(prev => prev.filter(record => record.id !== attendanceId));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to process time-out"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error processing time-out"
      });
    } finally {
      setProcessingTimeOut(null);
    }
  };

  const handleRefresh = () => {
    fetchAttendance(date);
  };

  useEffect(() => {
    fetchAttendance(date);
  }, [date]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Attendance Records</CardTitle>
            <div className="flex gap-2">
                <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                size="sm"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Bag Nummber</TableHead>
                    <TableHead>Baggage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No active attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.school_id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={record.current_avatar || 'images/def-avatar.svg'}
                              alt={record.full_name}
                              className="h-8 w-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'images/def-avatar.svg';
                              }}
                            />
                            {record.full_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(record.time_in_date), "pp")}
                        </TableCell>
                        <TableCell>
                          {record.baggage_number === null ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              No Baggage
                            </span>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.baggage_returned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              #{record.baggage_number} - {record.baggage_returned ? 'Returned' : 'Not Returned'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTimeOut(record.id)}
                            disabled={processingTimeOut === record.id || record.baggage_number === null}
                            className={record.baggage_number === null ? "cursor-not-allowed opacity-50" : ""}
                          >
                            {processingTimeOut === record.id ? "Processing..." : "Return"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}