export const clamp = (
  lower: number,
  value: number,
  upper: number = Number.MAX_SAFE_INTEGER,
) => {
  return Math.min(upper, Math.max(lower, value));
};

export const clampDuration = (
  duration: Temporal.Duration,
  minDuration = Temporal.Duration.from({ seconds: 0 }),
  maxDuration?: Temporal.Duration,
) => {
  const tempDuration =
    Temporal.Duration.compare(duration, minDuration) < 0
      ? minDuration
      : duration;
  if (maxDuration) {
    return Temporal.Duration.compare(tempDuration, maxDuration) > 0
      ? maxDuration
      : duration;
  } else {
    return tempDuration;
  }
};

export const toNumber = (str?: string) => {
  const num = Number(str);
  return isNaN(num) ? 0 : num;
};

export const isInteger = (str: string) => {
  const num = Number.parseInt(str);
  const regexTest = /^\d+$/.test(str);
  return !isNaN(num) && Number.isInteger(num) && num >= 0 && regexTest;
};
