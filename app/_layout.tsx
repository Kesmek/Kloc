import { SplashScreen, Stack } from "expo-router";
import { DATABASE_NAME, DataProvider } from "@/db/DataContext";
import { SQLiteProvider } from "expo-sqlite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { withUnistyles } from "react-native-unistyles";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
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
        {/* <DataProvider> */}
        <KeyboardProvider>
          <GestureHandlerRootView onLayout={() => SplashScreen.hide()}>
            <UniThemeProvider>
              <Stack
                screenOptions={{
                  headerTitleAlign: "center",
                  headerShadowVisible: false,
                  animation: "slide_from_right",
                  animationDuration: 250,
                }}
              >
                <Stack.Screen
                  name="(home)/index"
                  options={{
                    title: "Jobs",
                    // headerRight: (props) =>
                    //   delay ? null : <HeaderRight {...props} />,
                  }}
                />
                <Stack.Screen
                  name="(home)/CreateJob"
                  options={{ title: "New Job" }}
                />
                <Stack.Screen
                  name="(home)/[jobId]/edit"
                  options={{ title: "Edit Job" }}
                />
                <Stack.Screen
                  name="(home)/[jobId]/[paycycleId]/[shiftId]/index"
                  options={{ title: "Edit Shift" }}
                />
              </Stack>
            </UniThemeProvider>
          </GestureHandlerRootView>
        </KeyboardProvider>
        {/* </DataProvider> */}
      </QueryClientProvider>
    </SQLiteProvider>
  );
}

export default App;
