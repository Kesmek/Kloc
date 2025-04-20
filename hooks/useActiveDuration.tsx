import { useEffect, useState } from "react";

const useActiveDuration = (
  startTime: Temporal.Instant,
  endTime?: Temporal.Instant | null,
  active = true,
) => {
  const [duration, setDuration] = useState(
    startTime.until(endTime ?? Temporal.Now.instant()),
  );

  useEffect(() => {
    if (!endTime && active) {
      const timer = setInterval(
        () => setDuration(startTime.until(Temporal.Now.instant())),
        1000,
      );
      return () => clearInterval(timer);
    }
  }, [endTime, startTime, active]);

  useEffect(() => {
    setDuration(startTime.until(endTime ?? Temporal.Now.instant()));
  }, [startTime, endTime]);

  return {
    duration,
  };
};

export default useActiveDuration;
