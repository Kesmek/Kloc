import { useMemo } from "react";
import { stringToTime } from "@/utils/shiftFunctions";
import { ShiftCardProps } from "@/utils/typescript";
import useActiveDuration from "@/hooks/useActiveDuration";
import ShiftCard from "./ShiftCard";

const ActiveShift = ({ shift, minShiftDurationMins }: ShiftCardProps) => {
  const startTime = useMemo(
    () => Temporal.ZonedDateTime.from(shift.startTime),
    [shift.startTime],
  );

  const { duration } = useActiveDuration(startTime);

  return (
    <ShiftCard
      shift={{ ...shift, duration: duration.toString() }}
      durationFormat={(duration) => stringToTime(duration.toString())}
      minShiftDurationMins={minShiftDurationMins}
      breakDurationMins={0}
    />
  );
};

export default ActiveShift;
