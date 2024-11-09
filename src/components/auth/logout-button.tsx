"use client";

import { deleteTokensFromServer } from "@/actions/token";
import { useAuth } from "@/providers/authProviders";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await deleteTokensFromServer(); // Delete tokens from the server
      logout();
      window.location.reload();
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  return (
    <DropdownMenuItem asChild className="cursor-pointer">
      <div
        className="hover:bg-white/70 align-middle justify-center "
        onClick={handleLogout}
      >
        Logout
      </div>
    </DropdownMenuItem>
  );
}
