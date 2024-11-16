import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/providers";
import { AuthProvider } from "@/providers/authProviders";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { NotificationsProvider } from "@/contexts/NotificationsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GJC Library: Admin",
  description: "Manage and track student attendance and activity logs at the General De Jesus College Library.",
  keywords: "GJC Library, student attendance, student logs, college library management, academic resources",
  openGraph: {
    title: "GJC Library: Admin",
    description: "Monitor and record student attendance and activities at the General De Jesus College Library.",
    url: "https://admin.gjclibrary.com",
    siteName: "General De Jesus College Library",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GJC Library: Admin",
    description: "Streamline student library usage reporting at the General De Jesus College Library.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="https://cdn.tailwindcss.com"></Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<></>}>
          <AuthProvider>
            <ConvexClientProvider>
              <Providers>
                <NextTopLoader color="#E09900" />
                  <NotificationsProvider>
                    <Header />
                    {children}
                  </NotificationsProvider>
              </Providers>
              <Toaster />
            </ConvexClientProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}