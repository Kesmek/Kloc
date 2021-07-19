import { LogBox, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { colors, headerHeight } from "./src/utils/constants";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./src/types/navigation";
import { enableScreens } from "react-native-screens";
import Main from "./src/containers/Main";

enableScreens();

const persistor = persistStore(store);

const { Screen, Navigator } = createStackNavigator<RootStackParamList>();

const App = () => {
  LogBox.ignoreAllLogs(true);

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor("transparent");

  const darkTheme: Theme = {
    dark: true,
    colors: {
      primary: colors.PRIMARY_WHITE,
      background: colors.BLACK,
      card: colors.BLACK,
      text: colors.PRIMARY_WHITE,
      border: colors.BORDER,
      notification: colors.PURPLE,
    },
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer theme={darkTheme}>
            <Navigator
              screenOptions={{
                animationEnabled: true,
                gestureEnabled: false,
                headerStyle: { height: headerHeight },
                headerLeftContainerStyle: { paddingLeft: 15 },
                headerRightContainerStyle: { paddingRight: 15 },
                headerTitleAlign: "center",
                headerTransparent: true,
                // headerBackImage: () => (
                //   <Image
                //     style={{ width: scale(14), height: scale(21) }}
                //     source={require("../../../assets/images/appBar/back.png")}
                //   />
                // ),
                //Prevents a slight flicker at header
                detachPreviousScreen: false,
              }}
            >
              <Screen
                name="Main"
                component={Main}
                options={{ headerShown: false }}
              />
            </Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
