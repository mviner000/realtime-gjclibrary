import { DashReloader } from "@/components/dashboard/DashReloader";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";
import LibraryLogin from "./_components/LibraryLogin";
import StepAttendanceForm from "./_components/StepAttendanceForm";

const DashboardPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="mt-16">
      <StepAttendanceForm />
    </div>
  );
};

export default DashboardPage;
