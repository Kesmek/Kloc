import { Text, type TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface LabelProps extends TextProps {}

const Label = ({ children, style }: LabelProps) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

const styles = StyleSheet.create((theme) => ({
  label: {
    fontSize: theme.sizes[6],
    fontWeight: "500",
    color: theme.colors.text,
  },
}));

export default Label;
