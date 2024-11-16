import AccountSearch from "@/components/AccountSearch";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const StudentsPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div>
      <AccountSearch />
    </div>
  );
};

export default StudentsPage;
