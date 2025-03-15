import { StyleProp, TextStyle, ViewProps } from "react-native";
import Label from "./Label";

interface SectionProps extends ViewProps {
  title?: string;
  style?: StyleProp<TextStyle>;
}

const Section = ({ children, title, style }: SectionProps) => {
  return (
    <>
      <Label style={style}>{title}</Label>
      {children}
    </>
  );
};

export default Section;
