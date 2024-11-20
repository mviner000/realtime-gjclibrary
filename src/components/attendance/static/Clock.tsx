import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");
  const formatHour = (hour: number) => formatTime(hour % 12 || 12);

  const displayHour = formatHour(time.getHours());
  const displayMin = formatTime(time.getMinutes());
  const displaySec = formatTime(time.getSeconds());
  const ampm = time.getHours() >= 12 ? "pm" : "am";

  return (
    <span className="font-bold font-mono">
      {displayHour}
      <span className="text-gray-300 dark:text-white animate-blink">:</span>
      {displayMin}
      <span className="text-gray-300 dark:text-white animate-blink">:</span>
      {displaySec} <span className="-ml-5 text-5xl">{ampm}</span>
    </span>
  );
};

export default Clock;
