"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";
import PincodeModal from "./header/PincodeModal";
import Cookie from "js-cookie";
import { LockKeyhole } from "lucide-react";
import { useGlobalStore } from "@/stores/globalStore";

const LockedComponent = ({ children }: PropsWithChildren) => {
  const { isLocked, setIsLocked, setIsPinModalOpen } = useGlobalStore();

  useEffect(() => {
    const isUnlocked = Cookie.get("unlocked-pin-timer");
    if (isUnlocked) {
      setIsLocked(false);
    }
  }, []);

  return (
    <>
      <div className="relative ">
        {isLocked && (
          <div
            onClick={() => setIsPinModalOpen(true)}
            className="absolute w-full h-full bg-customGreen2/50 backdrop-blur-[2px] cursor-pointer flex justify-center items-center rounded-md"
          >
            <LockKeyhole className="size-5 text-white" />
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default LockedComponent;
