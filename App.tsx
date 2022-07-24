import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "./src/screens/app";
import { RealmProvider } from "./src/backend/utils";

const Root = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.flex}>
        <RealmProvider>
          <App />
        </RealmProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default Root;
