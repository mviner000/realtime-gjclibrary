"use client";
import { useEffect } from "react";
import PincodeModal from "./PincodeModal";
import Cookie from "js-cookie";
import { useGlobalStore } from "@/stores/globalStore";
import { ProfileDropdown } from "./profile-dropdown";
import { CurrentUser } from "@/utils/getCurrentUser";
import { ModeToggle } from "./mode-toggle";

type Props = {
  user: CurrentUser | null;
};

export function HeaderActions({ user }: Props) {
  const { isLocked, setIsLocked } = useGlobalStore();

  useEffect(() => {
    const isUnlocked = Cookie.get("unlocked-pin-timer");
    if (isUnlocked) {
      setIsLocked(false);
    }
  }, [setIsLocked]); // Added setIsLocked to dependency array

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {user.is_staff && isLocked ? (
            <PincodeModal setIsLocked={setIsLocked} />
          ) : (
            <ProfileDropdown user={user} />
          )}
        </>
      ) : (
        <ModeToggle />
      )}
    </div>
  );
}
