import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

export const useDuration = (start?: Date | number, end?: Date | number) => {
  const [formattedEnd, setFormattedEnd] = useState(Date.now());

  useEffect(
    () => {
      if (start) {
        const interval = setInterval(
          () => setFormattedEnd(Date.now()),
          1000,
        );
        if (end) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }
    },
    [end, start],
  );

  if (!start) {
    return;
  } else if (end) {
    return intervalToDuration({ start, end });
  } else {
    return intervalToDuration({ start, end: formattedEnd });
  }
};
