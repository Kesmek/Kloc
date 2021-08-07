import { initialWindowMetrics, Metrics } from "react-native-safe-area-context";

export const { frame, insets } = initialWindowMetrics as Metrics;

export const headerHeight = 60 + insets.top;

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
  SECONDARY_PURPLE: "#DDBBFF",
  SECONDARY_RED: "#FF7788",
  SECONDARY_WHITE: "#A5A5A5",
  YELLOW: "#FFFF00",
};

export const monthNames = [
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

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "thursday",
  "Friday",
  "Saturday",
];
