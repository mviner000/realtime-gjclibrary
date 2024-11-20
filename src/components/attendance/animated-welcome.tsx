"use client";

import { useEffect, useState } from "react";

export default function AnimatedWelcome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`transform transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="text-7xl font-extrabold mb-6 text-center relative z-10">
          <span
            className=" font-bold bg-clip-text text-slate-300 bg-gradient-to-r from-yellow-400 to-green-500 animate-gradient-x"
            style={{
              textShadow: `
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000,
            2px 2px 0 #000,
            3px 3px 0 #000,
            4px 4px 0 rgba(0,0,0,0.2)
          `,
            }}
          >
            WELCOME!
          </span>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                backgroundColor: Math.random() > 0.5 ? "#FBBF24" : "#10B981",
                opacity: 0.3,
                animation: `float ${Math.random() * 10 + 5}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
