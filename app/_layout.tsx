import { Slot, SplashScreen } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { withUnistyles } from "react-native-unistyles";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { DATABASE_NAME, DataProvider } from "@/db/DataContext";
import "temporal-polyfill/global";
import "expo-dev-client";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const UniThemeProvider = withUnistyles(ThemeProvider, (theme) => ({
  value: {
    dark: theme.navigation.dark,
    colors: theme.navigation.colors,
    fonts: DefaultTheme.fonts,
  },
}));

function App() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <QueryClientProvider client={queryClient}>
        <DataProvider>
          <KeyboardProvider>
            <GestureHandlerRootView onLayout={() => SplashScreen.hide()}>
              <UniThemeProvider>
                <Slot />
              </UniThemeProvider>
            </GestureHandlerRootView>
          </KeyboardProvider>
        </DataProvider>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}

export default App;
