// app/attendance/page.tsx
import AttendanceEditor from "@/components/attendance/AttendanceEditor";
import AttendanceViewer from "@/components/attendance/AttendanceViewer";

export default function AttendancePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Attendance Editor</h2>
          <AttendanceEditor />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Live Attendance</h2>
          <AttendanceViewer />
        </div>
      </div>
    </div>
  );
}
