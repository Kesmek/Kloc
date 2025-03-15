import { SelectShift } from "@/db/schema";
import { clamp, clampDuration } from "./helpers";
import { CompleteShift, OTCycle } from "./typescript";

export const isOutsidePaycycle = (
  paycycleStart: Temporal.ZonedDateTime,
  paycycleDurationDays: number,
  startTime: Temporal.ZonedDateTime,
) => {
  const punchInDate = Temporal.ZonedDateTime.from(startTime);
  const endDate = paycycleStart.add({ days: paycycleDurationDays });

  return isBeforePaycycle(paycycleStart, punchInDate)
    ? -1
    : isAfterPaycycle(endDate, punchInDate)
      ? 1
      : 0;
};

export const isBeforePaycycle = (
  paycycleStart: Temporal.ZonedDateTime,
  punchInTime: Temporal.ZonedDateTime,
) => {
  return Temporal.ZonedDateTime.compare(punchInTime, paycycleStart) < 0;
};

export const isAfterPaycycle = (
  paycycleEnd: Temporal.ZonedDateTime,
  punchInTime: Temporal.ZonedDateTime,
) => {
  return Temporal.ZonedDateTime.compare(punchInTime, paycycleEnd) >= 0;
};

export const getNextStartDate = (
  currentPayrollPeriod: Temporal.ZonedDateTime,
  paycycleDays: number,
) => {
  return currentPayrollPeriod.add({ days: paycycleDays });
};

export const getPrevStartDate = (
  currentPayrollPeriod: Temporal.ZonedDateTime,
  paycycleDays: number,
) => {
  return currentPayrollPeriod.subtract({ days: paycycleDays });
};

const getRawTotalShiftDuration = (shifts: CompleteShift[]) =>
  shifts.reduce(
    (acc, shift) => acc.add(Temporal.Duration.from(shift.duration)),
    Temporal.Duration.from({ seconds: 0 }),
  );

const getTotalShiftDuration = (
  shifts: CompleteShift[],
  breakDurationMins: number,
) =>
  shifts.reduce(
    (acc, shift) =>
      acc.add(
        clampDuration(
          Temporal.Duration.from(shift.duration).subtract({
            minutes: breakDurationMins,
          }),
          Temporal.Duration.from({ hours: 3 }),
        ),
      ),
    Temporal.Duration.from({ seconds: 0 }),
  );

const durationToHours = (duration: Temporal.Duration) =>
  clamp(0, duration.total({ unit: "hours" })).toPrecision(3);

export const getPaycycleStats = (
  shifts: CompleteShift[],
  overtimeCycle: number,
  overtimeBoundaryMins: number,
  breakDurationMins: number,
  paycycleStartDate: Temporal.ZonedDateTime,
) => {
  const totalDuration = getRawTotalShiftDuration(shifts);
  const totalDurationAdjusted = getTotalShiftDuration(
    shifts,
    breakDurationMins,
  );
  let totalOvertimeDuration = Temporal.Duration.from({ seconds: 0 });

  if (overtimeCycle === OTCycle.Day) {
    totalOvertimeDuration = getOvertimeHoursDaily(
      shifts,
      overtimeBoundaryMins,
      Temporal.Duration.from({ minutes: breakDurationMins }),
    );
  } else {
    totalOvertimeDuration = getOvertimeHoursWeekly(
      shifts,
      overtimeBoundaryMins,
      breakDurationMins,
      paycycleStartDate,
    );
  }

  const { weekOneTotalDuration, weekTwoTotalDuration } = getWeeklyStats(
    shifts,
    breakDurationMins,
    paycycleStartDate,
  );

  return {
    totalHours: durationToHours(totalDuration),
    totalHoursAdjusted: durationToHours(totalDurationAdjusted),
    totalRegularHours: durationToHours(
      totalDurationAdjusted.subtract(totalOvertimeDuration),
    ),
    totalovertimeHours: durationToHours(totalOvertimeDuration),
    totalWeekOneHours: durationToHours(weekOneTotalDuration),
    totalWeekTwoHours: durationToHours(weekTwoTotalDuration),
  };
};

export const getWeeklyStats = (
  shifts: CompleteShift[],
  breakDurationMins: number,
  paycycleStartDate: Temporal.ZonedDateTime,
) => {
  //get the shifts in the first of the 2 weeks
  const firstWeekEndDate = paycycleStartDate.add({ weeks: 1 });
  const weekOneShifts = shifts.filter(
    (shift) =>
      //check if the start time is earlier than one week after the paycycles' start
      Temporal.ZonedDateTime.compare(
        Temporal.ZonedDateTime.from(shift.startTime),
        firstWeekEndDate,
      ) < 0,
  );
  const weekTwoShifts = shifts.filter(
    (shift) => !weekOneShifts.includes(shift),
  );
  const weekOneTotalDuration = getTotalShiftDuration(
    weekOneShifts,
    breakDurationMins,
  );
  const weekTwoTotalDuration = getTotalShiftDuration(
    weekTwoShifts,
    breakDurationMins,
  );

  return {
    weekOneTotalDuration,
    weekTwoTotalDuration,
  };
};

export const getOvertimeHoursWeekly = (
  shifts: CompleteShift[],
  overtimeBoundaryMins: number,
  breakDurationMins: number,
  paycycleStartDate: Temporal.ZonedDateTime,
) => {
  const { weekTwoTotalDuration, weekOneTotalDuration } = getWeeklyStats(
    shifts,
    breakDurationMins,
    paycycleStartDate,
  );

  const weekOneOvertime = clampDuration(
    weekOneTotalDuration.subtract({
      // overtimeBoundaryMins is measured per week, breakDeduction per shift
      minutes: overtimeBoundaryMins,
    }),
  );
  const weekTwoOvertime = clampDuration(
    weekTwoTotalDuration.subtract({
      minutes: overtimeBoundaryMins,
    }),
  );

  //add week 1 OT and week 2 OT
  return weekOneOvertime.add(weekTwoOvertime);
};

export const getOvertimeHoursDaily = (
  shifts: CompleteShift[],
  overtimeBoundaryMins: number,
  breakDuration: Temporal.Duration,
) => {
  const overtimeBoundary = Temporal.Duration.from({
    minutes: overtimeBoundaryMins,
  });
  let totalOvertime = Temporal.Duration.from({
    seconds: 0,
  });
  shifts.forEach((shift) => {
    const shiftOvertime = Temporal.Duration.from(
      shift.duration ?? { seconds: 0 },
    )
      .subtract(breakDuration)
      .subtract(overtimeBoundary)
      .round("seconds")
      .total({ unit: "second" });

    totalOvertime = totalOvertime.add({
      seconds: clamp(0, shiftOvertime),
    });
  });

  return totalOvertime;
};

export const stringToTime = (str: string) => {
  const matches = str.match(/(\d{1,3}\w{1})|(-)/g);
  return matches?.join(" ") ?? "";
};

export const filterOngoingShift = (shift: SelectShift) =>
  !filterCompleteShift(shift);

export const filterCompleteShift = (
  shift: SelectShift,
): shift is CompleteShift => shift.endTime !== null && shift.duration !== null;
