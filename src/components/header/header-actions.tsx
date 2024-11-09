"use client";
import { useEffect } from "react";
import PincodeModal from "./PincodeModal";
import Cookie from "js-cookie";
import { useGlobalStore } from "@/stores/globalStore";
import { ProfileDropdown } from "./profile-dropdown";
import { LoginButton } from "../auth/login-button";
import { CurrentUser } from "@/utils/getCurrentUser";
import { Button } from "../ui/button";
import Link from "next/link";
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
  }, []);

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
        // <Button asChild variant="secondary" size="sm">
        //   <Link href="/login">Sign In</Link>
        // </Button>
        <ModeToggle />
      )}
    </div>
  );
}
