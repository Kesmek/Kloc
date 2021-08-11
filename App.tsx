import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { colors } from "./src/utils/constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigation";
import { enableScreens } from "react-native-screens";
import Punches from "./src/containers/Punches";
import EditPunch from "./src/containers/EditPunch";
import ManualPunch from "./src/containers/ManualPunch";

enableScreens();

const persistor = persistStore(store);

const { Screen, Navigator } = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  LogBox.ignoreAllLogs(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");

  const darkTheme: Theme = {
    colors: {
      background: colors.BLACK,
      border: colors.BORDER,
      card: colors.BLACK,
      notification: colors.PRIMARY_PURPLE,
      primary: colors.PRIMARY_WHITE,
      text: colors.PRIMARY_WHITE,
    },
    dark: true,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer theme={darkTheme}>
            <Navigator
              screenOptions={{
                gestureEnabled: false,
              }}
            >
              <Screen component={Punches} name="Punches" />
              <Screen
                component={EditPunch}
                name="Edit Punch"
                options={{ animation: "slide_from_right" }}
              />
              <Screen
                component={ManualPunch}
                name="Manual Punch"
                options={{ animation: "slide_from_right" }}
                // options={{
                //   presentation: "transparentModal",
                // }}
              />
            </Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
