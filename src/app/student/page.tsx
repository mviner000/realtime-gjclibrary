import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const ProfilePage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <>
      Student
    </>

  );
};

export default ProfilePage;
