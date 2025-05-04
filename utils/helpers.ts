import type { StyleProp, ViewStyle } from "react-native";
import type { AnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

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
      : tempDuration;
  }
  return tempDuration;
};

export const toNumber = (str?: string) => {
  const num = Number(str);
  return Number.isNaN(num) ? 0 : num;
};

export const isInteger = (str: string) => {
  const num = Number.parseInt(str);
  const regexTest = /^\d+$/.test(str);
  return !Number.isNaN(num) && Number.isInteger(num) && num >= 0 && regexTest;
};

export const getStyleProp = (
  style: AnimatedStyle<StyleProp<ViewStyle>> | StyleProp<ViewStyle>,
  keyToGet: keyof ViewStyle,
) => {
  const flattenedStyle = StyleSheet.flatten(style);

  if (flattenedStyle && Object.hasOwn(flattenedStyle, keyToGet)) {
    return flattenedStyle[keyToGet as keyof typeof flattenedStyle];
  }

  // Return false if style is empty/falsy, key doesn't exist,
  // or the value associated with the key is not a number.
  return false;
};
