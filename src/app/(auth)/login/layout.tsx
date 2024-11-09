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
    <div className="mt-40 h-full">
      <div className=" flex items-center justify-center mt-5">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout