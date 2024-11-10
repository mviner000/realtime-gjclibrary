
import { PageDesignManager } from "@/components/moderator/PageDesign/PageDesignManager";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const DesignerPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
   <>
    <PageDesignManager />
   </>
  );
};

export default DesignerPage;
