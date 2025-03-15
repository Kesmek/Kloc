import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
  const { styles } = useStyles(stylesheet);
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

const stylesheet = createStyleSheet((theme) => ({
  separator: { backgroundColor: theme.colors.background },
}));

export default Separator;
