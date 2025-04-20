import type { Shift } from "@/db/schema";

export type Stringified<T> = {
  [K in keyof T]: string;
};

export enum OTCycle {
  Day = 1,
  Week = 7,
}

export enum Paycycle {
  Weekly = 7,
  Biweekly = 14,
}

type AssertValuesExist<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? NonNullable<T[K]> : T[P];
};

export interface CompleteShift extends AssertValuesExist<Shift, "endTime"> {}

export interface ShiftCardProps {
  jobId: number;
  shift: Shift;
  durationFormat?: (duration: Temporal.Duration) => string;
  minShiftDurationMins: number;
  breakDurationMins: number;
  ongoing: boolean;
}
