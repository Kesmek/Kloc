import { NavigationContainer } from "@react-navigation/native";
import type { Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployerPicker from "src/screens/employerPicker";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors } from "src/utils/constants";
import EditEmployer from "src/screens/editEmployer";
import BackButton from "src/components/BackButton";
import Shifts from "src/screens/shifts";
import EditShift from "src/screens/EditShift";

const { Navigator, Screen } = createNativeStackNavigator();

const title = (props: ({ children: string, tintColor?: string | undefined })) => (
  <View style={styles.titleWrapper}>
    <Text {...props} style={styles.headerTitleStyle}>Employers</Text>
    <Icon
      name={"work"}
      size={24}
      style={styles.headerTitleIconStyle}
    />
  </View>);

const App = () => {
  const theme: Theme = {
    dark: true,
    colors: {
      primary: Colors.PRIMARY,
      background: Colors.BACKGROUND,
      card: Colors.PRIMARY,
      notification: Colors.RED,
      border: Colors.BORDER,
      text: Colors.TEXT_DARK,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Navigator screenOptions={{ headerLargeTitle: true, headerLeft: BackButton, animation: "fade" }}>
        <Screen
          name={"Employer Picker"}
          component={EmployerPicker}
          options={{
            headerTitle: title,
          }}
        />
        <Screen
          name={"Edit Employer"}
          component={EditEmployer}
          options={{
            animation: "slide_from_bottom",
          }}
        />
        <Screen
          name={"Shifts"}
          component={Shifts}
        />
        <Screen
          name={"Edit Shift"}
          component={EditShift}
          options={{
            animation: "slide_from_bottom",
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  titleWrapper: { flexDirection: "row", alignItems: "center" },
  headerTitleStyle: { fontSize: 20, fontWeight: "bold", color: Colors.TEXT_DARK },
  headerTitleIconStyle: { marginLeft: 5, color: Colors.TEXT_DARK },
});

export default App;
