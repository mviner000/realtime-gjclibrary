"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component only renders after it's mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent rendering on the server
  }

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center">
      {resolvedTheme === "dark" ? (
        <Sun className="mr-2" />
      ) : (
        <Moon className="mr-2" />
      )}
      <Switch
        className="h-5 w-[2.6rem]"
        checked={resolvedTheme === "dark"}
        onCheckedChange={handleToggle}
        aria-readonly
      />
    </div>
  );
}
