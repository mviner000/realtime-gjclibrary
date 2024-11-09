"use client";

import { cn } from "@/lib/utils"

import localFont from 'next/font/local'


// Font files can be colocated inside of `pages`
const myFont = localFont({ src: './../../fonts/MonotypeOldEnglish.woff2' })


const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {

  return (
    <div className="mt-7 h-full ">
      <div className="flex align-middle text-center  text-black dark:text-white items-center justify-center">
        <div className={cn(
          "xxs:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl",
          myFont.className
        )}>General De Jesus College
          <h1 className="text-4xl">📚 Library 📚</h1>

        </div>
      </div>
      <h1 className="mt-2 align-middle text-center text-slate-400">Vallarta St., Poblacion, San Isidro, Nueva Ecija</h1>
      <div className=" flex items-center justify-center mt-5">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout