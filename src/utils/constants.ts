import { initialWindowMetrics, Metrics } from "react-native-safe-area-context";
import { dayTypes, monthTypes } from "../types/constants";

export const { frame, insets } = initialWindowMetrics as Metrics;

export const colors = {
  BACKGROUND: "#444444",
  BLACK: "#000000",
  BLUE: "#0000FF",
  BORDER: "#888899",
  CYAN: "#00FFFF",
  DISABLED_WHITE: "#747474",
  PRIMARY_GREEN: "#00CC00",
  PRIMARY_PURPLE: "#8060FF",
  PRIMARY_RED: "#FF0000",
  PRIMARY_WHITE: "#FFFFFF",
  SECONDARY_GREEN: "#99FF88",
  SECONDARY_PURPLE: "#BBAAFF",
  SECONDARY_RED: "#FF7788",
  SECONDARY_WHITE: "#A5A5A5",
  YELLOW: "#FFFF00",
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
