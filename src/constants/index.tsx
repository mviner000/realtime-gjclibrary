import { Calendar, House, LayoutDashboard, User2, Users } from "lucide-react";

export const PROFILE_API_URL = "/api/profile";
export const TOKEN_API_URL = "/api/check-token";

const PROFILE_LINK = {
  url: "/profile",
  name: "Profile",
  icon: <User2 className="size-5" />,
};

const DASHBOARD_LINK = {
  url: "/dashboard",
  name: "Dashboard",
  icon: <LayoutDashboard className="size-5" />,
};

const ATTENDANCE_LINK = {
  url: "/attendance",
  name: "Attendance Log",
  icon: <Calendar className="size-4" />,
};

const STUDENTS_LINK = {
  url: "/students",
  name: "Students",
  icon: <Users className="size-4" />,
};

export const ADMIN_NAV_LINKS = [
  PROFILE_LINK,
  DASHBOARD_LINK,
  ATTENDANCE_LINK,
  STUDENTS_LINK,
];

export const STUDENT_NAV_LINKS = [PROFILE_LINK];

export const PURPOSE_OF_VISIT = {
  TRANSACTION: "transaction",
  RESEARCH: "research",
  CLEARANCE: "clearance",
  VISITOR_OUTSIDER: "visitor_outsider",
  OTHERS: "others",
};

export const FILTER_DATE_BY = {
  ALL: "all",
  TODAY: "today",
  THIS_WEEK: "this week",
  THIS_MONTH: "this month",
  CUSTOM: "custom",
};
