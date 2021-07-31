import { initialWindowMetrics, Metrics } from "react-native-safe-area-context";

export const { frame, insets } = initialWindowMetrics as Metrics;

export const headerHeight = 60 + insets.top;

export const colors = {
  PRIMARY_RED: "#FF0000",
  SECONDARY_RED: "#FF7788",
  PRIMARY_GREEN: "#00CC00",
  SECONDARY_GREEN: "#99FF88",
  BLUE: "#0000FF",
  PRIMARY_PURPLE: "#8060FF",
  SECONDARY_PURPLE: "#DDBBFF",
  CYAN: "#00FFFF",
  YELLOW: "#FFFF00",
  PRIMARY_WHITE: "#FFFFFF",
  SECONDARY_WHITE: "#A5A5A5",
  DISABLED_WHITE: "#747474",
  BLACK: "#000000",
  BORDER: "#888899",
};
