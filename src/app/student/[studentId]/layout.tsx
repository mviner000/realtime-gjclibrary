import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const StudentDetailsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return <>{children}</>;
};

export default StudentDetailsLayout;
