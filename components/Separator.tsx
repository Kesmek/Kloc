import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface SeparatorProps {
  thickness?: number;
  direction?: "vertical" | "horizontal";
  color?: string;
}
const Separator = ({
  thickness = 2,
  direction = "horizontal",
  color,
}: SeparatorProps) => {
  return (
    <View
      style={[
        direction === "vertical"
          ? {
              width: thickness,
            }
          : {
              height: thickness,
            },
        styles.separator,
        {
          backgroundColor: color,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  separator: { backgroundColor: theme.colors.background },
}));

export default Separator;
