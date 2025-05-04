import {
  View,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
  type ViewProps,
} from "react-native";
import Label from "./Label";

interface SectionProps extends Omit<ViewProps, "style"> {
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const Section = ({ children, title, style, titleStyle }: SectionProps) => {
  return (
    <View style={style}>
      <Label style={titleStyle}>{title}</Label>
      {children}
    </View>
  );
};

export default Section;
