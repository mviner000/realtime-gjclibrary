import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";
import { SettingsBreadcrumb } from "@/components/moderator/SettingsBreadcrumb";
import LeftSideBarLayouWrapper from "@/components/wrappers/leftSideBarLayouWrapper";
import LeftSideBarLayoutWrapper from "@/components/wrappers/leftSideBarLayouWrapper";
import getCurrentUser from "@/utils/getCurrentUser";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GJC Library Admin",
  description: "Admin dashboard for staffs",
};

export default async function AttendanceV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  return (
    <main>
      <GJCLeftSideBar />
      <LeftSideBarLayouWrapper>
        <SettingsBreadcrumb />
        {children}
      </LeftSideBarLayouWrapper>
    </main>
  );
}
