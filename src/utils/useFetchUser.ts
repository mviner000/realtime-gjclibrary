import useSWR from "swr";
import { useAuth } from "@/providers/authProviders";
import useCheckAuth from "@/hooks/useCheckAuth";
import { useEffect } from "react";

// Custom error class for handling fetch errors
class FetchError extends Error {
  info: any;
  status: number;

  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

// Fetcher function to get data from the API
const fetcher = async (url: string): Promise<any> => {
  const res: Response = await fetch(url);

  if (!res.ok) {
    const error = new FetchError(
      "An error occurred while fetching the data.",
      await res.json(),
      res.status
    );
    throw error;
  }

  return res.json();
};

// API URL for fetching profile data
const PROFILE_API_URL = "/api/profile";

export const useFetchUser = () => {
  const isAuthenticated = useCheckAuth(); // Check if the user is authenticated
  const auth = useAuth();

  // Don't fetch data if the user is not authenticated
  const { data, error, isLoading } = useSWR(
    isAuthenticated ? PROFILE_API_URL : null,
    fetcher
  );

  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

  // Determine the role based on is_staff
  const isAdmin = data?.is_staff;
  const role = isAdmin ? "admin" : "user";

  return { data, error, isLoading, role };
};