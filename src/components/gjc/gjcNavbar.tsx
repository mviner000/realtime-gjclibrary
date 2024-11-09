"use client";

import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { CurrentUser } from "@/utils/getCurrentUser";
import { ProfileDropdown } from "../header/profile-dropdown";
import { ModeToggle } from "../header/mode-toggle";

type Props = {
  user: CurrentUser | null;
};

export function GJCNavbar({ user }: Props) {
  const pathname = usePathname();
  
  const navbarStyle = useQuery(api.queries.getComponentStyle, { 
    componentName: "navbar" 
  });

  const navbarLogoStyle = useQuery(api.queries.getComponentStyle, { 
    componentName: "navbar.logo" 
  });

  const navbarParentLinksStyle = useQuery(api.queries.getComponentStyle, { 
    componentName: "navbar.link.parent" 
  });

  const navbarChildrenLinksStyle = useQuery(api.queries.getComponentStyle, { 
    componentName: "navbar.link.children" 
  });

  if (!navbarStyle || !navbarLogoStyle || !navbarParentLinksStyle || !navbarChildrenLinksStyle) {
    return <div className="text-muted-foreground">Loading navbar styles...</div>;
  }

  const showProfileDropdown = pathname !== "/login" && user;

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 text-base bg-emerald-500", navbarStyle.tailwindClasses)}>
      <div className="w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="https://gjclibrary.com/" className="relative size-14">
            <img
              src="/images/library-logo.png"
              style={{ objectFit: 'cover', width: '20vw', height: 'auto' }}
              alt="Logo"
              className={cn("object-cover", navbarLogoStyle.tailwindClasses)}
            />
          </Link>
          <nav>
            <ul className={cn("flex space-x-4", navbarParentLinksStyle.tailwindClasses)}>
              {showProfileDropdown ? (
                <>
                <li className={cn("text-base cursor-pointer", navbarChildrenLinksStyle.tailwindClasses)}>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className={cn("text-base cursor-pointer", navbarChildrenLinksStyle.tailwindClasses)}>
                <Link href="/settings">Settings</Link>
              </li>
                <ProfileDropdown user={user} />
                </>
              ) : (
                !user && <ModeToggle />
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}