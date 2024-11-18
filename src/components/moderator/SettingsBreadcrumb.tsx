"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SettingsBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const getReadableText = (segment: string) => {
    return segment
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <nav className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto mb-4 mx-5 lg:mx-7">
      <Link
        href="/"
        className="text-gray-600 dark:text-gray-300 hover:text-gray-400/80 flex items-center flex-shrink-0"
        aria-label="Home"
      >
        <Home className="w-5 h-5 sm:hidden" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
            {isLast ? (
              <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                {getReadableText(segment)}
              </span>
            ) : (
              <Link
                href={path}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-400/80 hover:underline truncate"
              >
                {getReadableText(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
