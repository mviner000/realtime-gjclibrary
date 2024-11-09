import { cn } from "@/lib/utils";
import getCurrentUser from "@/utils/getCurrentUser";
import { redirect } from "next/navigation";

import localFont from 'next/font/local'
import DueDateGrid from "@/components/card/DueDateGrid";
import Grid from "@/components/card/Grid";

const myFont = localFont({ src: './../../fonts/TimesNewRoman.woff2' })

const ProfilePage: React.FC = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <>
      {/* xxs:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl */}
      <div className={cn(
        "dark:text-black space-y-2 mt-10 mx-5 h-[720px] py-5 bg-customYellow justify-center items-center",
        myFont.className
      )}>
        <div className="flex flex-row justify-between">
          <div className="pl-10 font-bold text-black text-xl">
            STUDENT BORROWERS CARD
          </div>
          <div className="-space-y-2">
            <div className="pr-10 font-semibold text-black text-lg">
              GJC Library
            </div>
            <div className="pr-10 font-semibold text-black text-lg">
              San Isidro, N.E.
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <span className="pl-10 font-bold text-black text-xl">
            Name:
          </span>
          <span className="ml-2 border-b border-black w-96 font-semibold text-black text-xl">
            Melvin E. Nogoy
          </span>
        </div>
        <div className="flex flex-row pb-10">
          <span className="pl-10 font-bold text-black text-xl">
            Year:
          </span>
          <span className="ml-3.5 border-b border-black w-36 font-bold text-black text-xl">
            BSIT - III
          </span>
          <span className="pl-5 font-bold text-black text-xl">
            Section:
          </span>
          <span className="ml-3.5 border-b border-black w-36 font-bold text-black text-xl">
            A
          </span>
        </div>
        <div>
          <DueDateGrid />

          <Grid />
        </div>
      </div>
    </>

  );
};

export default ProfilePage;
