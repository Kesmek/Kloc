import { NavigationContainer, Theme } from '@react-navigation/native';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { store } from 'src/redux/store';
import Main from 'src/screens/Main';
import { colors } from 'src/utils/constants';

const persistor = persistStore(store);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const theme: Theme = {
    colors: {
      background: colors.BACKGROUND,
      border: colors.BORDER,
      card: colors.BLACK,
      notification: colors.PRIMARY_PURPLE,
      primary: colors.SECONDARY_PURPLE,
      text: colors.PRIMARY_WHITE,
    },
    dark: true,
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <NavigationContainer theme={theme}>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <Main />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
