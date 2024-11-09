// "use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { BackButton } from "@/components/auth/back-button";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";

import { Poppins } from "next/font/google";
import Image from "next/image";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

type CardWrapperProps = {
  children: React.ReactNode;
  headerTitle: string;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  headerLabelColor?: string;
};

export const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  headerLabelColor
}: CardWrapperProps) => {
  return (
    <Card className="mt-12 mb-10 md:w-[425px] w-[360px] shadow-md border-8 border-cyan-900">
      <CardHeader className="relative">
        <img
          className="absolute bottom-24 md:left-[132px] left-[98px]"
          src="https://i.imgur.com/XZutH81.png"
          width={142}
          height={142}
          alt="General De Jesus Logo"
        />
        <div className="static inline-block">
          <div className="mt-10 ml-[-8px] text-3xl font-bold mb-2 text-center text-black dark:text-white">{headerTitle}</div>
          <Separator className="absolute right-0 bg-cyan-800 h-[1px] w-full" />
        </div>
        <Header textColor={headerLabelColor} label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <Separator className="right-0 bg-cyan-800 h-[1px] mb-3" />
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
