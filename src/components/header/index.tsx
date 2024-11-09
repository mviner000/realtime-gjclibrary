import Link from "next/link";
import { HeaderActions } from "./header-actions";
import Image from "next/image";
import getCurrentUser from "@/utils/getCurrentUser";
import NotifsToggle from "@/components/layout/Notifs/notifs-toggle";
import { NavbarWrapper } from "../moderator/NavbarWrapper";

export async function Header() {
  const user = await getCurrentUser();

  return (
    // <div className="sticky top-0 z-[99] border-b-4 border-b-customGold bg-customGreen2 py-2">
    //   <div className="container mx-auto flex items-center justify-between">
    //     <div className="flex items-center gap-8">
    //       <Link href="https://gjclibrary.com/" className="relative size-14">
    //         <img
    //           src="/images/library-logo.png"
    //           style={{ objectFit: 'cover', width: '20vw', height: 'auto' }}
    //           alt="Logo"
    //           className="object-cover"
    //         />
    //       </Link>
    //     </div>
    //     <div className="flex justify-center items-center gap-3">
    //       <NotifsToggle />
    //       <HeaderActions user={user} />
    //     </div>
    //   </div>
    // </div>

    <NavbarWrapper />
  );
}
