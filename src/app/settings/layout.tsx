import { ReactNode } from 'react';
import SettingsBreadcrumb from '@/components/moderator/SettingsBreadcrumb';
import GJCLeftSideBar from '@/components/gjc/gjcLeftSideBar';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <main className="pt-24 pl-72">
      <GJCLeftSideBar />
      <SettingsBreadcrumb />
      {children}
    </main>
  );
}