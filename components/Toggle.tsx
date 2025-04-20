import { View, Text } from "react-native";
import { BaseButton } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native-unistyles";

interface ToggleProps<T extends string | number> {
  firstValue: T;
  secondValue: T;
  firstLabel?: string;
  secondLabel?: string;
  accentColor?: string;
  buttonWidth: number;
  onPressLeft?: (firstValue: T) => void;
  onPressRight?: (secondValue: T) => void;
  disabled?: boolean;
  value?: T;
}

const Toggle = <T extends string | number>({
  firstValue,
  firstLabel,
  secondValue,
  secondLabel,
  accentColor,
  buttonWidth = 50,
  onPressLeft,
  onPressRight,
  disabled,
  value = firstValue,
}: ToggleProps<T>) => {
  const transition = useSharedValue(value === firstValue ? 0 : buttonWidth);

  const animatedAccentStyle = useAnimatedStyle(() => ({
    left: transition.value,
  }));

  const onTogglePressRight = () => {
    transition.value = withTiming(buttonWidth);
    onPressRight?.(secondValue);
  };

  const onTogglePressLeft = () => {
    transition.value = withTiming(0);
    onPressLeft?.(firstValue);
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Animated.View
        style={[
          {
            width: buttonWidth,
            backgroundColor: accentColor,
          },
          styles.accent,
          animatedAccentStyle,
        ]}
      />
      <BaseButton
        rippleColor={"transparent"}
        enabled={!disabled}
        onPress={onTogglePressLeft}
      >
        <Text style={[{ width: buttonWidth }, styles.text]}>{firstLabel}</Text>
      </BaseButton>
      <BaseButton
        rippleColor={"transparent"}
        enabled={!disabled}
        onPress={onTogglePressRight}
      >
        <Text style={[{ width: buttonWidth }, styles.text]}>{secondLabel}</Text>
      </BaseButton>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.slate7,
    borderRadius: theme.radii.xl,
    alignSelf: "flex-start",
    alignItems: "center",
    overflow: "hidden",
    paddingVertical: theme.spacing[1],
  },
  text: {
    textAlign: "center",
    fontSize: theme.sizes[4],
    fontWeight: "bold",
    textTransform: "capitalize",
    color: theme.colors.text,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  accent: {
    top: 0,
    bottom: 0,
    position: "absolute",
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
}));

export default Toggle;
