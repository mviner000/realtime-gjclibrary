import { LayoutDashboard, User2, Users } from "lucide-react";

export const PROFILE_API_URL = "/api/profile";
export const TOKEN_API_URL = "/api/check-token";


// for dropdown menu

const createProfileLink = (studentId?: string) => ({
  url: studentId ? `/student/${studentId}` : "/student",
  name: "Profile",
  icon: <User2 className="size-5" />,
});

const DASHBOARD_LINK = {
  url: "/dashboard",
  name: "Dashboard",
  icon: <LayoutDashboard className="size-5" />,
};

const STUDENTS_LINK = {
  url: "/student",
  name: "Students",
  icon: <Users className="size-4" />,
};

export const ADMIN_NAV_LINKS = (schoolId?: string) => [
  createProfileLink(schoolId),
  DASHBOARD_LINK,
  STUDENTS_LINK,
];

export const STUDENT_NAV_LINKS = createProfileLink;

export const FILTER_DATE_BY = {
  ALL: "all",
  TODAY: "today",
  THIS_WEEK: "this week",
  THIS_MONTH: "this month",
  CUSTOM: "custom",
};
