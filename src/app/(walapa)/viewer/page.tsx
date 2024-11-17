import NotesViewer from "@/components/notes/NotesViewer";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const ViewerPage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Real-time Notes App
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Notes Viewer</h2>
          <NotesViewer />
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
