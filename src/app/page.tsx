"use client"

import { LoadingState } from "@/constants/loading-state";
import { useFetchUser } from "@/utils/useFetchUser";
import { redirect } from "next/navigation";

const Homepage = () => {
  const { data, error, role, isLoading } = useFetchUser();

  if (error) {
    return <LoadingState />;
  }

  if (isLoading) return <div>Loading...</div>; // add a loading state

  role === "user" ? redirect("/dashboard") : null;

  if (!data) {
    redirect("/dashboard");
  }

  // if none of the above conditions are met, render the homepage content
  return <div>Welcome to the homepage!</div>;
};

export default Homepage;