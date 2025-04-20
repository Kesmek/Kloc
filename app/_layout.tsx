import { Slot, SplashScreen } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "temporal-polyfill/global";
import { DATABASE_NAME, DataProvider, tursoOptions } from "@/db/DataContext";
import { SQLiteProvider } from "expo-sqlite";
import { SystemBars } from "react-native-edge-to-edge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function App() {
  const { theme } = useUnistyles();

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      options={{
        libSQLOptions: {
          url: tursoOptions.url,
          authToken: tursoOptions.authToken,
        },
      }}
      onInit={async () => {
        await SplashScreen.hideAsync();
      }}
    >
      <QueryClientProvider client={queryClient}>
        <DataProvider>
          <GestureHandlerRootView style={styles.container}>
            <ThemeProvider
              value={{
                dark: theme.navigation.dark,
                colors: theme.navigation.colors,
                fonts: DefaultTheme.fonts,
              }}
            >
              <SystemBars style={"auto"} />
              <Slot />
            </ThemeProvider>
          </GestureHandlerRootView>
        </DataProvider>
      </QueryClientProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create((_, rt) => ({
  container: {
    flex: 1,
    paddingBottom: rt.insets.bottom,
  },
}));

export default App;
