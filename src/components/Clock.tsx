import { NextPage } from "next";
import { useEffect, useState } from "react";

interface Props {
  militaryTime: boolean;
}

const Clock: NextPage<Props> = ({ militaryTime }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");
  const formatHour = (hour: number) => {
    if (militaryTime) {
      return formatTime(hour);
    }
    const adjustedHour = hour % 12 || 12;
    return formatTime(adjustedHour);
  };

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
      {displaySec} {!militaryTime && <span className="-ml-5 text-5xl">{ampm}</span>}
    </span>
  );
};

export default Clock;