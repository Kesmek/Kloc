import { Slot, SplashScreen } from "expo-router";
import "@/constants/unistyles";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "temporal-polyfill/global";
import { DATABASE_NAME, DataProvider, tursoOptions } from "@/db/DataContext";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/migrations/migrations";
import { SQLiteProvider } from "expo-sqlite";

SplashScreen.preventAutoHideAsync();

const runMigrations = async (db: any) => {
  console.log("Running migrations...");
  await migrate(db, migrations);
  console.log("Migrations complete.");
  await SplashScreen.hideAsync();
};

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
        enableChangeListener: true,
      }}
      onInit={runMigrations}
    >
      <DataProvider>
        <GestureHandlerRootView style={styles.container}>
          <ThemeProvider
            value={{
              dark: theme.navigation.dark,
              colors: theme.navigation.colors,
              fonts: DefaultTheme.fonts,
            }}
          >
            <Slot />
          </ThemeProvider>
        </GestureHandlerRootView>
      </DataProvider>
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
