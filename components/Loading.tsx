import { Text } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const Loading = () => {
  return <Text style={styles.loading}>Loading...</Text>;
};

const styles = StyleSheet.create((theme) => ({
  loading: {
    fontWeight: "bold",
    color: theme.colors.text,
  },
}));

export default Loading;
