import { Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface IconProps extends ComponentProps<typeof Feather> {}

const Icon = ({ name, size, color, style }: IconProps) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Feather
      name={name}
      size={size ?? theme.sizes[6]}
      color={color ?? theme.colors.text}
      style={[styles.icon, style]}
    />
  );
};

const stylesheet = createStyleSheet(() => ({
  icon: {},
}));

export default Icon;
