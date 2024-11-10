"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            imgRef.current &&
            imgRef.current.dataset.src
          ) {
            imgRef.current.src = imgRef.current.dataset.src;
            imgRef.current.onload = () => setImageLoaded(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px" }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="mt-7 h-full">
       <div className="fixed inset-0 -z-10">
        <Image
          src="/mavs/back.jpg"
          alt="GJC Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
      </div>
      <div className="flex align-middle text-center text-black dark:text-white items-center justify-center">
        {/* <div className={cn(
          "xxs:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl",
          myFont.className
        )}>
          General De Jesus College
          <h1 className="text-4xl">📚 Library 📚</h1>
        </div> */}
      </div>
      {/* <h1 className="mt-2 align-middle text-center text-slate-400">
        Vallarta St., Poblacion, San Isidro, Nueva Ecija
      </h1> */}
      <div className="flex items-center justify-center mt-5">{children}</div>
      {/* <div className="absolute top-[47rem]">
        <div className="text-center xs:ml-2 xs:mt-4 md:ml-5 lg:ml-14 lg:mt-0 lg:rotate-1">
          {!imageLoaded && <></>}
          <img
            ref={imgRef}
            data-src="/images/erg-snoos.webp"
            alt="Description of the image"
            className={cn(
              "xs:w-50 md:w-70 lg:w-7/12 h-auto object-cover transition-opacity duration-1000 ease-in-out",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div> */}
    </div>
  );
};

export default AuthLayout;
