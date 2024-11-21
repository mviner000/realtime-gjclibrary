import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";
import { Button } from "@/components/ui/button";
import LeftSideBarLayoutWrapper from "@/components/wrappers/leftSideBarLayouWrapper";
import getCurrentUser from "@/utils/getCurrentUser";
import Link from "next/link";
import { redirect } from "next/navigation";

const HomePage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="pt-16">
      <img src="/images/esternon-home.jpg" alt="esternon" className="h-auto" />
    </div>
  );
};

export default HomePage;
