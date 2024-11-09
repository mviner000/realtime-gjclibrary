"use client";

import { env } from "@/env";
import { Announcement } from "@/types";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export function LatesAnnouncement() {
  const pathname = usePathname();
  const [latestAnnouncement, setLatestAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    fetch(`${env.NEXT_PUBLIC_API_URL!}/latest_announcement/`)
      .then((response) => response.json())
      .then((data) => setLatestAnnouncement(data))
      .catch((error) => console.error(error));
  }, []);

  if (pathname !== "/dashboard") return;

  return (
    <>
      {latestAnnouncement?.content && (
        <div className="text-center align-middle">
          <div className="py-4 bg-gradient-to-r from-fuchsia-500 from-10% via-sky-500 via-80% to-emerald-500 to-90%">
            <div className="text-3xl font-semibold text-slate-100">
              <h2>{latestAnnouncement.content}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
