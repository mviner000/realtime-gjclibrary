import { DashReloader } from '@/components/dashboard/DashReloader';
import getCurrentUser from '@/utils/getCurrentUser';
import { redirect } from 'next/navigation';

const DashboardPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");


  return (
    <DashReloader />
  );
}

export default DashboardPage;
