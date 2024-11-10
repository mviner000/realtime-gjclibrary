import GJCLeftSideBar from '@/components/gjc/gjcLeftSideBar';
import SettingsBreadcrumb from '@/components/moderator/SettingsBreadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GJC Library Admin',
  description: 'Admin dashboard for staffs'
};

export default function DesignerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-24 pl-72">
      <GJCLeftSideBar />
      <SettingsBreadcrumb />
        {children}
      </main>
  );
}
