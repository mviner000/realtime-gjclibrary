"use client";
import Link from "next/link";
import { ADMIN_NAV_LINKS, STUDENT_NAV_LINKS } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "../auth/logout-button";
import { ModeToggle } from "./mode-toggle";
import { CurrentUser } from "@/utils/getCurrentUser";
import { useEffect, useState } from "react";
import QuickLoginForm from "../QuickLoginForm";

const NEXT_AVATAR_API_AURL = "api/avatar";

export function ProfileDropdown({ user }: { user: CurrentUser }) {
  const navLinks = user.is_staff
    ? ADMIN_NAV_LINKS(user.school_id, user.username)
    : [STUDENT_NAV_LINKS(user.school_id)];

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    async function fetchAvatar() {
      const response = await fetch(NEXT_AVATAR_API_AURL);
      const data = await response.json();
      setAvatarUrl(data.cropped_avatar_url);
    }
    fetchAvatar();
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback className="bg-customGreen text-white border border-customGold">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="shadow-lg w-full rounded-full"
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  alt="User Avatar"
                />
              ) : (
                user.username[0].toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[100] space-y-2">
          <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="ml-2">
            <ModeToggle />
          </div>
          {user.username !== "abad52310078" && (
            <div className="ml-2">
              <QuickLoginForm />
            </div>
          )}
          <DropdownMenuSeparator />
          {navLinks.map((link) => (
            <DropdownMenuItem
              key={link.name}
              asChild
              className="cursor-pointer"
            >
              <Link className="flex items-center gap-2" href={link.url}>
                {link.icon} {link.name}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}