import { env } from "@/env";
import fetcher from "@/lib/fetcher";
import { getToken } from "@/lib/token";
import { redirect } from "next/navigation";
import { cache } from "react";

const DJANGO_API_PROFILE_URL = `${env.NEXT_PUBLIC_API_URL!}/profile/admin`;

export type CurrentUser = {
  username: string;
  email: string;
  is_authenticated: boolean;
  is_staff: boolean;
  school_id: string;
  onboard1_finished: boolean;
  current_cropped_avatar: string;
};

const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = getToken();

  if (!token) return null;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(DJANGO_API_PROFILE_URL, options);

  return await response.json();
});

export default getCurrentUser;
