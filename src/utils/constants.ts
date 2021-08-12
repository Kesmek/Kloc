import { initialWindowMetrics, Metrics } from "react-native-safe-area-context";
import { dayTypes, monthTypes } from "../types/constants";

export const { frame, insets } = initialWindowMetrics as Metrics;

export const colors = {
  BACKGROUND: "#222222",
  BLACK: "#111111",
  BORDER: "#9292A6",
  CYAN: "#00FFFF",
  PRIMARY_BLUE: "#0000FF",
  PRIMARY_GREEN: "#00CC00",
  PRIMARY_PURPLE: "#8060FF",
  PRIMARY_RED: "#FF0000",
  PRIMARY_WHITE: "#DDDDDD",
  PRIMARY_YELLOW: "#FFFF00",
  SECONDARY_BLUE: "#5555FF",
  SECONDARY_GREEN: "#99FF88",
  SECONDARY_PURPLE: "#BBAAFF",
  SECONDARY_RED: "#FF7788",
  SECONDARY_WHITE: "#A5A5A5",
  SECONDARY_YELLOW: "#DDDD66",
};

export const monthNames: monthTypes[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const dayNames: dayTypes[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
