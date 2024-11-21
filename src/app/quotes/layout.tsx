import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";
import { SettingsBreadcrumb } from "@/components/moderator/SettingsBreadcrumb";
import getCurrentUser from "@/utils/getCurrentUser";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "GJC Library Admin",
  description: "Admin dashboard for staffs",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  return (
    <main className="pt-24 pl-72">
      <GJCLeftSideBar />
      <SettingsBreadcrumb />
      {children}
    </main>
  );
}
