import { StyleSheet } from "react-native-unistyles";
import {
  slate,
  slateDark,
  iris,
  irisDark,
  red,
  redDark,
  green,
  greenDark,
  amber,
  amberDark,
} from "@radix-ui/colors";

const remToPx = (num: number, basePx = 16) => {
  return num * basePx;
};

export const radii = {
  xs: remToPx(0.125),
  sm: remToPx(0.25),
  md: remToPx(0.375),
  lg: remToPx(0.5),
  xl: remToPx(0.75),
  "2xl": remToPx(1),
  "3xl": remToPx(1.5),
  full: remToPx(1000),
};

export const spacing = {
  0: remToPx(0),
  px: remToPx(1 / 16),
  0.5: remToPx(1 / 8),
  1: remToPx(1 / 4),
  1.5: remToPx(3 / 8),
  2: remToPx(1 / 2),
  2.5: remToPx(5 / 8),
  3: remToPx(3 / 4),
  3.5: remToPx(7 / 8),
  4: remToPx(1),
  4.5: remToPx(1 + 1 / 8),
  5: remToPx(1.25),
  6: remToPx(1.5),
  7: remToPx(1.75),
  8: remToPx(2),
  9: remToPx(2.25),
  10: remToPx(2.5),
  11: remToPx(2.75),
  12: remToPx(3),
  14: remToPx(3.5),
  16: remToPx(4),
  20: remToPx(5),
  24: remToPx(6),
  28: remToPx(7),
  32: remToPx(8),
  36: remToPx(9),
  40: remToPx(10),
  44: remToPx(11),
  48: remToPx(12),
  52: remToPx(13),
  56: remToPx(14),
  60: remToPx(15),
  64: remToPx(16),
  72: remToPx(18),
  80: remToPx(20),
  96: remToPx(24),
};

export const sizes = {
  ...spacing,
  md: remToPx(28),
  lg: remToPx(32),
  xl: remToPx(36),
  "2xl": remToPx(42),
  "3xl": remToPx(48),
  "4xl": remToPx(56),
  "5xl": remToPx(64),
  "6xl": remToPx(72),
  "7xl": remToPx(80),
  "8xl": remToPx(90),
  full: "100%",
} as const;

export const borderWidths = {
  none: 0,
  veryThin: 1,
  thin: 2,
  normal: 3,
  thick: 4,
  veryThick: 5,
};

export const lightTheme = {
  colors: {
    ...slate,
    ...iris,
    ...red,
    ...green,
    ...amber,
    background: slate.slate1,
    error: red.red9,
    text: slate.slate12,
    textSecondary: slate.slate10,
    textDark: slate.slate1,
    textLight: slate.slate12,
    ripple: "#FFFFFF52",
    accent: iris.iris9,
    transparent: "#00000000",
    border: slate.slate7,
    success: green.green9,
  },
  button: {
    base: {
      color: slate.slate1,
    },
    success: {
      backgroundColor: green.green8,
    },
    error: {
      backgroundColor: red.red8,
    },
  },
  spacing,
  radii,
  sizes,
  borderWidths,
  navigation: {
    dark: false,
    colors: {
      primary: iris.iris9,
      background: slate.slate1,
      card: slate.slate2,
      text: slate.slate12,
      border: slate.slate7,
      notification: iris.iris9,
    },
  },
} as const;

export const darkTheme = {
  colors: {
    ...slateDark,
    ...irisDark,
    ...redDark,
    ...greenDark,
    ...amberDark,
    background: slateDark.slate1,
    text: slateDark.slate12,
    textSecondary: slateDark.slate10,
    textDark: slateDark.slate1,
    textLight: slateDark.slate12,
    ripple: "#FFFFFF52",
    error: redDark.red9,
    accent: irisDark.iris9,
    success: greenDark.green9,
    transparent: "#00000000",
    border: slateDark.slate7,
  },
  button: {
    base: {
      color: slateDark.slate1,
    },
    success: {
      backgroundColor: greenDark.green8,
    },
    error: {
      backgroundColor: redDark.red8,
    },
  },
  spacing,
  radii,
  sizes,
  borderWidths,
  navigation: {
    dark: true,
    colors: {
      primary: irisDark.iris9,
      background: slateDark.slate1,
      card: slateDark.slate2,
      text: slateDark.slate12,
      border: slateDark.slate7,
      notification: irisDark.iris9,
    },
  },
} as const;

// if you defined themes
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

// override library types
declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    adaptiveThemes: true,
  },
});
