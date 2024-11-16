import GJCLeftSideBar from '@/components/gjc/gjcLeftSideBar';
import SettingsBreadcrumb from '@/components/moderator/SettingsBreadcrumb';
import LeftSideBarLayoutWrapper from '@/components/wrappers/leftSideBarLayouWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GJC Library Admin',
  description: 'Admin dashboard for staffs'
};

export default function StudentsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      <GJCLeftSideBar />
        <LeftSideBarLayoutWrapper>
          <SettingsBreadcrumb />
          {children}
        </LeftSideBarLayoutWrapper>
    </main>
  )
}