// app/attendance/page.tsx
import AttendanceViewer from "@/components/attendance/AttendanceViewer";
import BaggageCards from "@/components/attendance/BaggageCards";

export default function AttendancePage() {
  return (
    <div className="container mx-auto p-4">
      <BaggageCards />
      <div>
        <AttendanceViewer />
      </div>
    </div>
  );
}
