import { DashReloader } from "@/components/dashboard/DashReloader";
import { Button } from "@/components/ui/button";
import getCurrentUser from "@/utils/getCurrentUser";
import Link from "next/link";
import { redirect } from "next/navigation";

const DashboardPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    // <DashReloader />
    <div className="flex flex-col justify-center items-center h-full w-full space-y-4">
      <Link href="/attendance">
        <Button
          variant="default"
          className="dark:text-white text-2xl font-bold w-64 bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Attendance Logger
        </Button>
      </Link>

      <Link href="/attendances/feed">
        <Button
          variant="default"
          className="dark:text-white text-2xl font-bold w-64 bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Attendance Feed
        </Button>
      </Link>
      <Link href="/attendances/view">
        <Button
          variant="default"
          className="dark:text-white text-2xl font-bold w-64 bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Attendance Admin
        </Button>
      </Link>
    </div>
  );
};

export default DashboardPage;
