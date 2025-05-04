import { Text, type TextProps } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const Label = ({ children, style }: TextProps) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

const styles = StyleSheet.create((theme) => ({
  label: {
    fontSize: theme.sizes[5],
    fontWeight: "500",
    color: theme.colors.text,
  },
}));

export default Label;
