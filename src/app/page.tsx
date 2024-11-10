import FloatingInfoButton from "@/components/FloatingInfoButton";
import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";
import LeftSideBarLayoutWrapper from "@/components/wrappers/leftSideBarLayouWrapper";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

const HomePage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

return (
    <>
    <GJCLeftSideBar/>
    <LeftSideBarLayoutWrapper>
    <FloatingInfoButton />
      <div className="-ml-8 -mt-8">
        <img
          src="/images/proposal/homepage.jpg"
          alt="homepae proposal"
          width={2000}
          height="auto"
        />
      </div>
      </LeftSideBarLayoutWrapper>
    </>
  );
};

export default HomePage;