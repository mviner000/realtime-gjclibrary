// app/attendance/page.tsx
import AttendanceViewer from "@/components/attendance/AttendanceViewer";

export default function AttendancePage() {
  return (
    <div className="container mx-auto p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Live Attendance</h2>
        <AttendanceViewer />
      </div>
    </div>
  );
}
