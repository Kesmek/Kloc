import { type ComponentProps, forwardRef, useState } from "react";
import { Text, View } from "react-native";
import {
  type NativeViewGestureHandlerProperties,
  TextInput,
} from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface TextInputProps
  extends Omit<ComponentProps<typeof TextInput>, "hitSlop">,
    NativeViewGestureHandlerProperties {
  error?: boolean;
  errorMessage?: string;
}

const CustomTextInput = forwardRef<TextInput, TextInputProps>(
  (
    {
      error = false,
      errorMessage = "An error occurred",
      style,
      maxLength = 100,
      ...textInputProps
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const { theme } = useUnistyles();

    return (
      <View>
        <TextInput
          style={[
            styles.textInput,
            focused && styles.focused,
            error && styles.error,
            style,
          ]}
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={theme.colors.slate7}
          placeholder="Input text..."
          cursorColor={theme.colors.text}
          maxLength={maxLength}
          {...textInputProps}
        />
        {error && errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create((theme) => ({
  textInput: {
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.slate7,
    borderRadius: theme.radii["2xl"],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    width: theme.sizes[60],
    fontSize: theme.sizes[4],
    color: theme.colors.text,
  },
  focused: {
    borderColor: theme.colors.slate8,
  },
  error: {
    borderColor: theme.colors.error,
  },
  errorMessage: {
    color: theme.colors.error,
    marginLeft: theme.spacing[2],
  },
}));

export default CustomTextInput;
