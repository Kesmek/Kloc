import {
  View,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
  type ViewProps,
} from "react-native";
import Label from "./Label";
import Icon, { type IconProps } from "./Icon";
import { StyleSheet } from "react-native-unistyles";

interface SectionProps extends Omit<ViewProps, "style"> {
  iconName?: Pick<IconProps, "name">["name"];
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const Section = ({
  children,
  title,
  style,
  titleStyle,
  iconName,
}: SectionProps) => {
  return (
    <View style={style}>
      <View style={styles.row}>
        {iconName && <Icon name={iconName} style={titleStyle} />}
        <Label style={titleStyle}>{title}</Label>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    gap: theme.spacing[1],
    alignItems: "center",
  },
}));

export default Section;
