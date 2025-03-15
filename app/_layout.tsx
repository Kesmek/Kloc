import { Slot, SplashScreen } from "expo-router";
import { Text } from "react-native";
import "@/constants/unistyles";
import { useEffect } from "react";
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from "react-native-unistyles";
import { ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "temporal-polyfill/global";
import { useMigrationsHelper } from "@/db/drizzle";
import { DatabaseProvider } from "@/db/provider";

SplashScreen.preventAutoHideAsync();

function App() {
  const { success, error } = useMigrationsHelper();
  const { styles } = useStyles(stylesheet);

  if (error) {
    SplashScreen.hideAsync();

    return <Text style={styles.text}>Migration error: {error.message}</Text>;
  } else if (!success) {
    return <Text style={styles.text}>Migration is in progress...</Text>;
  }

  return <RootLayout />;
}

function RootLayout() {
  const { styles, theme } = useStyles(stylesheet);

  useEffect(() => {
    UnistylesRuntime.setRootViewBackgroundColor(theme.colors.background);
    UnistylesRuntime.statusBar.setColor(theme.colors.slate2);
    UnistylesRuntime.navigationBar.setColor(theme.colors.slate2);
    SplashScreen.hideAsync();
  }, []);

  return (
    <DatabaseProvider>
      <GestureHandlerRootView style={styles.container}>
        <ThemeProvider value={theme.navigation}>
          <Slot />
        </ThemeProvider>
      </GestureHandlerRootView>
    </DatabaseProvider>
  );
}

const stylesheet = createStyleSheet((_, rt) => ({
  text: {
    marginTop: rt.insets.top,
  },
  container: {
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
}));

export default App;
