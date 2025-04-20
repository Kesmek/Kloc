import { useMemo } from "react";
import { stringToTime } from "@/utils/shiftFunctions";
import type { ShiftCardProps } from "@/utils/typescript";
import useActiveDuration from "@/hooks/useActiveDuration";
import ShiftCard from "./ShiftCard";

const ActiveShift = ({
  shift,
  minShiftDurationMins,
  jobId,
}: ShiftCardProps) => {
  const startTime = useMemo(
    () => Temporal.Instant.from(shift.startTime),
    [shift.startTime],
  );

  const { duration } = useActiveDuration(startTime);

  return (
    <ShiftCard
      shift={{ ...shift }}
      durationFormat={(duration) => stringToTime(duration.toString())}
      minShiftDurationMins={minShiftDurationMins}
      breakDurationMins={0}
      jobId={jobId}
    />
  );
};

export default ActiveShift;
