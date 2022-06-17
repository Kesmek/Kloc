import { intervalToDuration } from "date-fns";

export const getMonthName = (month: number) => {
  switch (month) {
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "January";
  }
};

export const padNumber = (time?: number) => {
  if (typeof time === "undefined") {
    return;
  }
  if (time < 10) {
    return `0${time}`;
  } else {
    return `${time}`;
  }
};

export const formatDurationString = (duration?: Duration, format?: string) => {
  let durationString = "";
  let hourSeparator = ":";
  let minuteSeparator = ":";
  let secondSeparator = "";
  let minutes = duration?.minutes?.toString();
  if (!duration) {
    return;
  }

  switch (format?.toLowerCase()) {
    case "l":
      hourSeparator = "h ";
      minuteSeparator = "m ";
      secondSeparator = "s";
      break;
    default:
      break;
  }
  if (duration.hours) {
    durationString = `${
      (duration?.hours ?? 0) + 24 * (duration?.days ?? 0)
    }${hourSeparator}`;
    minutes = padNumber(duration.minutes);
  }
  return durationString.concat(`${minutes}${minuteSeparator}${padNumber(duration.seconds)}${secondSeparator}`);
};

export const formatIntervalString = (interval: Interval, format?: string) => {
  return formatDurationString(
    intervalToDuration(interval),
    format,
  );
};
