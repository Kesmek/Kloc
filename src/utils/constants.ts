import { initialWindowMetrics, Metrics } from "react-native-safe-area-context";

export const { frame, insets } = initialWindowMetrics as Metrics;

export const headerHeight = 50 + insets.top;

export const colors = {
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF",
  PURPLE: "#6600FF",
  CYAN: "#00FFFF",
  YELLOW: "#FFFF00",
  PRIMARY_WHITE: "#FFFFFF",
  SECONDARY_WHITE: "#A5A5A5",
  DISABLED_WHITE: "#747474",
  BLACK: "#000000",
  BORDER: "#232323",
};
