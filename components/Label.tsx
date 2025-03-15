import { Text, TextProps } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface LabelProps extends TextProps {}

const Label = ({ children, style }: LabelProps) => {
  const { styles } = useStyles(stylesheet);

  return <Text style={[styles.label, style]}>{children}</Text>;
};

const stylesheet = createStyleSheet((theme) => ({
  label: {
    fontSize: theme.sizes[6],
    fontWeight: "500",
    color: theme.colors.text,
  },
}));

export default Label;
