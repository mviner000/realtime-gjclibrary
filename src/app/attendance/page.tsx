import { DashReloader } from '@/components/dashboard/DashReloader';
import getCurrentUser from '@/utils/getCurrentUser';
import { redirect } from 'next/navigation';

const DashboardPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");


  return (
    // <DashReloader />
    <div className="-ml-8 -mt-8">
        <img
          src="/images/attendance_purpose.jpg"
          alt="homepae proposal"
          width={2000}
          height="auto"
        />
      </div>
  );
}

export default DashboardPage;
