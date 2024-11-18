import React, { useState, useEffect } from "react";

const CountdownRedirect = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center mt-4 space-y-2">
      <div className="text-green-600 font-medium animate-pulse">
        Automatically redirecting in {count}
      </div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(count / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownRedirect;
