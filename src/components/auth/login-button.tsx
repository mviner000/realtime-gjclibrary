"use client";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/constants/loading-state";
import { useAuth } from "@/providers/authProviders";
import { useFetchUser } from "@/utils/useFetchUser";
import Link from "next/link";
import { useEffect } from "react";

export function LoginButton() {
  const { data, error, isLoading } = useFetchUser();
  const auth = useAuth();

  useEffect(() => {
    if (error?.status === 401) {
      auth.loginRequiredRedirect();
    }
  }, [auth, error]);

  if (isLoading) return <LoadingState />;

  return (
    <>
        {data && (
            <Button asChild variant="secondary">
                <Link href="/login">Sign In</Link>
            </Button>
        )}
    </>
  );
}
