"use client";
import fetcher from "@/lib/fetcher";
import { useAuth } from "@/providers/authProviders";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const TOKEN_API_URL = "/api/check-token";

const useCheckAuth = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { data, error } = useSWR(TOKEN_API_URL, fetcher);

  // Call the callback function with the result when data is available
  useEffect(() => {
    if (data) {
      setHasToken(!!data?.token);
    }
  }, [data, setHasToken]);

  return hasToken;
};

export default useCheckAuth;
