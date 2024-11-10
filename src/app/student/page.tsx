import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";
import StudentSearch from "./_components/StudentSearch";

const ProfilePage: React.FC = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Search</h1>
      <StudentSearch />
    </div>
  );
};

export default ProfilePage;