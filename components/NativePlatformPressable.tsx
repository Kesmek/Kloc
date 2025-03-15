import { ForwardedRef, forwardRef } from "react";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import {
  BaseButtonProps,
  BorderlessButton,
  RectButton,
} from "react-native-gesture-handler";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface NativePlatformPressableProps extends Omit<BaseButtonProps, "style"> {
  label?: string;
  accessibilityLabel?: string;
  style?: AnimatedStyle<StyleProp<ViewStyle>>;
  children?: React.ReactNode;
  borderless?: boolean;
  unstyled?: boolean;
  disabled?: boolean;
}

const useExtractStyles = (style: AnimatedStyle<StyleProp<ViewStyle>>) => {
  const containerAttributes = [
    "borderRadius",
    "overflow",
    "alignSelf",
    "flex",
    "margin",
    "marginTop",
    "marginRight",
    "marginLeft",
    "marginBottom",
    "marginVertical",
    "marginHorizontal",
    "maxWidth",
  ] as const;

  const bothAttributes = containerAttributes.filter(
    (prop) => prop === "borderRadius",
  );

  type ContainerAttribute = (typeof containerAttributes)[number];
  type bothAttributes = (typeof bothAttributes)[number];
  const containerStyle: ViewStyle = {};
  const viewStyle: ViewStyle = {};

  Object.entries(StyleSheet.flatten(style) || {}).forEach(([key, value]) => {
    if (containerAttributes.includes(key as ContainerAttribute)) {
      containerStyle[key as ContainerAttribute] = value;
      if (bothAttributes.includes(key as bothAttributes)) {
        (viewStyle as any)[key] = value;
      }
    } else {
      (viewStyle as any)[key] = value;
    }
  });

  return { containerStyle, viewStyle };
};

const NativePlatformPressable = forwardRef<
  BorderlessButton | RectButton,
  NativePlatformPressableProps
>(
  (
    {
      label,
      accessibilityLabel = label && label !== "Back"
        ? `${label}, back`
        : "Go back",
      borderless = false,
      children,
      disabled,
      style,
      testID,
      unstyled = false,
      ...buttonProps
    },
    ref,
  ) => {
    const { styles } = useStyles(stylesheet);
    const { containerStyle, viewStyle } = useExtractStyles(style);

    return borderless ? (
      <BorderlessButton
        ref={ref as ForwardedRef<BorderlessButton>}
        enabled={!disabled}
        foreground={true}
        testID={testID}
        style={[disabled && styles.disabled, containerStyle]}
        hitSlop={10}
        {...buttonProps}
      >
        <Animated.View
          accessibilityRole="button"
          accessible
          accessibilityLabel={accessibilityLabel}
          style={[!unstyled && styles.borderlessButton, viewStyle]}
        >
          {children}
        </Animated.View>
      </BorderlessButton>
    ) : (
      <RectButton
        ref={ref as ForwardedRef<RectButton>}
        enabled={!disabled}
        foreground={true}
        testID={testID}
        style={[
          !unstyled && styles.container,
          disabled && styles.disabled,
          containerStyle,
        ]}
        hitSlop={10}
        {...buttonProps}
      >
        <Animated.View
          accessibilityRole="button"
          accessible
          accessibilityLabel={accessibilityLabel}
          style={[!unstyled && styles.button, viewStyle]}
        >
          {children}
        </Animated.View>
      </RectButton>
    );
  },
);

const stylesheet = createStyleSheet((theme) => ({
  button: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  borderlessButton: {
    padding: theme.spacing[1],
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    borderRadius: theme.radii.xl,
  },
  disabled: {
    opacity: 0.5,
  },
}));

export default NativePlatformPressable;
