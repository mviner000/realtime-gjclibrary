import { PageDesignManager } from "@/components/moderator/PageDesign/PageDesignManager";

const DesignerSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="sm:text-5xl font-bold mb-4">
        User Interface Design Settings - Mack Rafanan
      </h1>
      <p className="mb-6">Welcome to the designer settings page.</p>
      <PageDesignManager />
    </div>
  );
};

export default DesignerSettingsPage;
