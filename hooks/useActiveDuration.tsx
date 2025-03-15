import { useEffect, useState } from "react";

const useActiveDuration = (
  startTime: Temporal.ZonedDateTime,
  endTime?: Temporal.ZonedDateTime | null,
) => {
  const [duration, setDuration] = useState(
    startTime
      .until(endTime ?? Temporal.Now.zonedDateTimeISO())
      .round("seconds"),
  );

  useEffect(() => {
    if (!endTime) {
      const timer = setInterval(
        () =>
          setDuration(
            startTime.until(Temporal.Now.zonedDateTimeISO()).round("seconds"),
          ),
        1000,
      );
      return () => clearInterval(timer);
    }
  }, [endTime, startTime]);

  useEffect(() => {
    setDuration(
      startTime
        .until(endTime ?? Temporal.Now.zonedDateTimeISO())
        .round("seconds"),
    );
  }, [startTime, endTime]);

  return {
    duration,
  };
};

export default useActiveDuration;
