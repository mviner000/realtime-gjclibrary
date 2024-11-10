"use client"

import FloatingInfoButton from "@/components/FloatingInfoButton";
import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";
import { LoadingState } from "@/constants/loading-state";
import { useFetchUser } from "@/utils/useFetchUser";

const Homepage = () => {
  const { data, error, role, isLoading } = useFetchUser();

  if (error) {
    return <LoadingState />;
  }

  if (isLoading) return <div>Loading...</div>; // add a loading state

return (
  <main className="pt-[65px] pl-64">
    <GJCLeftSideBar />
    <FloatingInfoButton />
      <img
        src="/images/proposal/homepage.jpg"
        alt="homepae proposal"
        width={2000}
        height="auto"
      />
  </main>
  );
};

export default Homepage;