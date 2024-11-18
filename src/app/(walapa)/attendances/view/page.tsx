// app/attendance/page.tsx
import AttendanceViewer from "@/components/attendance/AttendanceViewer";
import BaggageCards from "@/components/attendance/BaggageCards";

export default function AttendancePage() {
  return (
    <div className="container mx-auto p-4">
      <BaggageCards />
      <div>
        <h2 className="text-2xl font-bold my-4">Live Attendance</h2>
        <AttendanceViewer />
      </div>
    </div>
  );
}
