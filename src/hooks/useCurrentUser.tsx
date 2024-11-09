import { PROFILE_API_URL } from "@/constants";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/providers/authProviders";
import React, { useEffect } from "react";
import useSWR from "swr";

const useCurrentUser = () => {
  const { data, error, isLoading, isValidating } = useSWR(
    PROFILE_API_URL,
    fetcher
  );

  const auth = useAuth();
  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

  return { data, error, isLoading, isValidating };
};

export default useCurrentUser;
