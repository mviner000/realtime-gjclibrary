import { LayoutDashboard, User2, Users } from "lucide-react";

export const PROFILE_API_URL = "/api/profile";
export const TOKEN_API_URL = "/api/check-token";

const createProfileLink = (studentId?: string) => ({
  // url: studentId ? `/student/${studentId}` : "/student",
  url: "/profile",
  name: "Profile",
  icon: <User2 className="size-5" />,
});

const DASHBOARD_LINKS = [
  {
    url: "/dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    url: "/student",
    name: "Students",
    icon: <Users className="size-4" />,
  },
];

export const ADMIN_NAV_LINKS = (schoolId?: string, username?: string) => {
  // Filter out the Students link if username is abad52310078
  const filteredDashboardLinks = username === "abad52310078"
    ? DASHBOARD_LINKS.filter(link => link.name !== "Students")
    : DASHBOARD_LINKS;

  return [
    createProfileLink(schoolId),
    ...filteredDashboardLinks,
  ];
};

export const STUDENT_NAV_LINKS = createProfileLink;

export const FILTER_DATE_BY = {
  ALL: "all",
  TODAY: "today",
  THIS_WEEK: "this week",
  THIS_MONTH: "this month",
  CUSTOM: "custom",
};