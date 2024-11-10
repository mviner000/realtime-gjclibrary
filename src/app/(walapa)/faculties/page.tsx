import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const FacultiesPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <h1 className="text-3xl font-bold">
      Wala Pa Faculties Page
    </h1>
  );
};

export default FacultiesPage;
