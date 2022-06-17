import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { IconProps } from "react-native-vector-icons/Icon";
import Animated from "react-native-reanimated";

type Props =
  {
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<ViewStyle>
  } & IconProps & RectButtonProps;

const IconButton = (
  {
    name,
    size,
    style,
    color,
    onPress,
    iconStyle,
    disabledStyle,
    enabled = true,
    children,
  }: Props) => {
  return (
    <Animated.View style={[styles.default, style, enabled ? {} : [styles.disabled, disabledStyle]]}>
      <RectButton style={styles.button} onPress={onPress} enabled={enabled}>
        <Icon name={name} color={color} size={size} style={iconStyle}/>
        {children}
      </RectButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  default: {
    overflow: "hidden",
  },
  button: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    elevation: 0,
  },
});

export default IconButton;
