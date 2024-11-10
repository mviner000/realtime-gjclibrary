
import { PageDesignManager } from "@/components/moderator/PageDesign/PageDesignManager";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const DesignerSettingsPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="p-6">
   <h1 className="text-6xl font-bold mb-4">User Interface Design Settings - Mack Rafanan</h1>
      <p className="mb-6">Welcome to the main settings page.</p>
    <PageDesignManager />
   </div>
  );
};

export default DesignerSettingsPage;
