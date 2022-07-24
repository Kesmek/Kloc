import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

export const useDuration = (
  start?: Date,
  end?: Date,
) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(
    () => {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      if (end) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    },
    [end, start],
  );

  if (!start) {
    return;
  } else if (end) {
    return intervalToDuration({ start, end });
  } else {
    return intervalToDuration({
      start, end: Date.now(),
    });
  }
};
