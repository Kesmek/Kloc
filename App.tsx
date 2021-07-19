import { LogBox, StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App = () => {
  LogBox.ignoreAllLogs(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");

  return (
    <SafeAreaProvider>
      <View />
    </SafeAreaProvider>
  );
};

export default App;
