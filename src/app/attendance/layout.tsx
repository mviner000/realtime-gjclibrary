import GJCLeftSideBar from "@/components/gjc/gjcLeftSideBar";

import LeftSideBarLayoutWrapper from "@/components/wrappers/leftSideBarLayouWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GJC Library Admin",
  description: "Admin dashboard for staffs",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mt-16 pt-2">{children}</div>;
}
