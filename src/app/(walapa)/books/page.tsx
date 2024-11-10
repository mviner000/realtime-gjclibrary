import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const BookPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <h1 className="text-3xl font-bold">
      Wala Pa Book Page
    </h1>
  );
};

export default BookPage;
