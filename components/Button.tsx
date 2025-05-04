import type { ComponentProps } from "react";
import { RectButton } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";

const Button = (props: ComponentProps<typeof RectButton>) => {
  return (
    <RectButton {...props} style={[styles.button, props.style]}>
      {props.children}
    </RectButton>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    backgroundColor: theme.colors.slate9,
    color: theme.colors.text,
    borderRadius: theme.radii.lg,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[3],
    alignItems: "center",
  },
}));

export default Button;
