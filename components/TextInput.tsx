/* eslint-disable react/display-name */
import { type ComponentProps, forwardRef, useState } from "react";
import { Text, View } from "react-native";
import {
  type NativeViewGestureHandlerProperties,
  TextInput,
} from "react-native-gesture-handler";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

interface TextInputProps
  extends Omit<ComponentProps<typeof TextInput>, "hitSlop">,
    NativeViewGestureHandlerProperties {
  error?: boolean;
  errorMessage?: string;
}

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.slate7,
  cursorColor: theme.colors.text,
}));

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

    return (
      <View>
        <UniTextInput
          style={[
            styles.textInput,
            focused && styles.focused,
            error && styles.error,
            style,
          ]}
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Input text..."
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
