"use client";
import { ReactNode } from "react";
import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}