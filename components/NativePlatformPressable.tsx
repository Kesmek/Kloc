import { type ForwardedRef, forwardRef } from "react";
import {
  StyleSheet as RNStyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  type BaseButtonProps,
  BorderlessButton,
  RectButton,
} from "react-native-gesture-handler";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

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

  Object.entries(RNStyleSheet.flatten(style) || {}).forEach(([key, value]) => {
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
  typeof BorderlessButton | typeof RectButton,
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
    const { containerStyle, viewStyle } = useExtractStyles(style);

    return borderless ? (
      <BorderlessButton
        ref={ref as ForwardedRef<typeof BorderlessButton>}
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
        ref={ref as ForwardedRef<typeof RectButton>}
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

const styles = StyleSheet.create((theme) => ({
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
