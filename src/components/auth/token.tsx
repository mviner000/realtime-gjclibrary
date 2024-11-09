"use client";

import { useEffect } from "react";
import useSWR from "swr";

class FetchError extends Error {
  info: any;
  status: number;

  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

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

const TOKEN_API_URL = "/api/check-token";

// Define the TokenChecker component
const TokenChecker: React.FC<{ onTokenCheck: (hasToken: boolean) => void }> = ({
  onTokenCheck,
}) => {
  const { data, error } = useSWR(TOKEN_API_URL, fetcher);

  // Call the callback function with the result when data is available
  useEffect(() => {
    if (data) {
      onTokenCheck(!!data.token);
    }
  }, [data, onTokenCheck]);

  return null; // This component does not render anything visible
};

export default TokenChecker;
