// app/attendance/page.tsx
import AttendanceViewer from "@/components/attendance/AttendanceViewer";
import StoryCard from "@/components/attendance/StoryCards";

export default function AttendancePage() {
  return (
    <div className="container mx-auto p-4">
      <StoryCard />
      <div>
        <h2 className="text-2xl font-bold my-4">Live Attendance</h2>
        <AttendanceViewer />
      </div>
    </div>
  );
}
