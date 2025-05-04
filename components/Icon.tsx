import Feather from "@expo/vector-icons/Feather";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native-unistyles";

export type IconProps = ComponentProps<typeof Feather>;

const Icon = ({ name, size, color, style }: IconProps) => {
  return (
    <Feather
      style={[styles.icon, style]}
      name={name}
      size={size}
      color={color}
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
