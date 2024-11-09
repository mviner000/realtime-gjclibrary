import useCheckAuth from "@/hooks/useCheckAuth";
import { useAuth } from "@/providers/authProviders";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect, RedirectType } from "next/navigation";
import React, { useState } from "react";

const StudentsPage = async () => {
  const user = await getCurrentUser();

  /**
      Ginawa ko nalang ganito kasi yung previous implementation, need ng useEffect para ma check kung is_staff/admin, pag wala kasi useEffect matic redirect agad sa unang render eh pag wala pa yung data.
      Kaso ang prob bawal na gumamit ng useEffect dahil parang nagkaka unli re-render yata kaya ayon ganito nalnag ginawa ko.
   */
  if (!user?.is_staff) {
    redirect("/dashboard", RedirectType.replace);
  }

  return (
    <div className="text-2xl">
      <h1>Students Page</h1>
    </div>
  );
};

export default StudentsPage;
