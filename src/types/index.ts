export interface ButtonType {
  _id: string;
  tailwindClasses: string;
}

export type BadgeType = {
  _id: string;
  tailwindClasses: string;
};

import { Icons } from "@/components/icons";

export type UserId = number;

export type StudentInfo = {
  // id: string;
  school_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: Gender;
  course: Course | null;
  major: null;
  year_level: string;
  position?: string | null;
  role: string;
};

export interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface Notification {
  id: number;
  notification_type: "email" | "in_app" | "sms";
  content_type: string;
  quote_id?: number | null;
  book_card_id?: number | null;
  message: string;
  created_at: string; // ISO string format for date
  read_at?: string | null; // ISO string format, optional or null if unread
  user_username: string;
  email_subject?: string | null;
  email_body?: string | null;
  inapp_title?: string | null;
  inapp_body?: string | null;
  sms_message?: string | null;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  posted_by: string;
  created_at: string;
  updated_at: string;
  approval_status: "approved" | "pending" | "disapproved"; // Possible statuses
  approved_by: string | null; // Could be empty string, treat it as nullable
}

export interface AttendanceOut {
  id: string;
  school_id: string;
  full_name: string;
  purpose: string;
  course: string;
  time_in_date: string;
  classification: string;
  current_cropped_image: string | null;
  cropped_avatar_url: string | null;
  attendance_count: number;
}

export interface PaginatedAttendanceOut {
  items: AttendanceOut[];
  total: number;
  page: number;
  size: number;
}

export enum Gender {
  FEMALE = "Female",
  MALE = "Male",
}

export enum Course {
  BSIT = "BSIT",
  BSHM = "BSHM",
  BSA = "BSA",
  BSED = "BSED",
  BSBA = "BSBA",
}

export type Attendance = {
  id: number;
  purpose: string;
  status: string;
  student_id: string;
  student_name: string;
  course: Course | null;
  time_in_date: string;
  time_out_date: string | null;
  has_already_timed_in: boolean;
  has_already_timed_out: boolean;
};

export type AttendanceV2 = {
  id: number;
  school_id: string;
  purpose: string;
  status: string;
  account_name: string;
  classification: string;
  course: Course | null;
  time_in_date: string;
  time_out_date: string | null;
  has_already_timed_in: boolean;
  has_already_timed_out: boolean;
};

export type ScanInfo = (StudentInfo & Attendance) | null;

export type Announcement = {
  id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export interface BookRecord {
  record_type: string;
  datetime: string;
  placing_number: number;
  book_transaction_id: number;
  account_school_id: string;
  status: string;
  callno: string;
  accession_number: string;
  book_title: string;
}

export interface BookTransaction {
  id: number;
  book_title: string;
  callno: string | null;
  accession_number: string | null;
  status: string;
  account_school_id: string;
  records: BookRecord[];
}

export interface BookSuggestion {
  callno: string;
  title: string;
}

export interface AccessionSuggestion {
  accession_number: string;
}

export interface CellData {
  value: string;
  isLineThrough: boolean;
  needsMarginTop?: boolean;
}

export interface TransactionData {
  callno: string;
  accession_number: string;
  status: string;
  accounts_school_id: string;
  transaction_date: string;
  placing_number: number;
}

export interface GridProps {
  studentId: string;
}

export interface Account {
  school_id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  gender: string | null;
  course: string | null;
  department: string | null;
  position: string | null;
  major: string | null;
  year_level: string | null;
  image: string | null;
  role: string | null;
  is_activated: boolean;
  current_cropped_image: string | null;
  activation_date: string | null; // ISO format date
  isBookCardPhotoApproved: "approved" | "disapproved" | "pending";
}

export interface Picture {
  id: number;
  picture_url: string;
  upload_date: string;
  cropped_image_url: string;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
