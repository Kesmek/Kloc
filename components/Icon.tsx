import Feather from "@expo/vector-icons/Feather";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native-unistyles";

interface IconProps extends ComponentProps<typeof Feather> {}

const Icon = ({ name, size, color, style }: IconProps) => {
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      style={[styles.icon, style]}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  icon: {
    color: theme.colors.text,
    fontSize: theme.sizes[6],
  },
}));

export default Icon;
