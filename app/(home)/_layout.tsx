import Icon from "@/components/Icon";
import { Link, Stack } from "expo-router";
import { BorderlessButton } from "react-native-gesture-handler";
import type { NativeStackHeaderRightProps } from "@react-navigation/native-stack";

const HeaderRight = (props: NativeStackHeaderRightProps) => (
  <Link href={"/CreateJob"} asChild>
    <BorderlessButton>
      <Icon name="plus" color={props.tintColor} />
    </BorderlessButton>
  </Link>
);

const Home = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        animation: "slide_from_right",
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Jobs",
          // headerRight: (props) => (delay ? null : <HeaderRight {...props} />),
          headerRight: (props) => <HeaderRight {...props} />,
        }}
      />
      <Stack.Screen name="[jobId]/index" options={{ title: "Paycycles" }} />
      <Stack.Screen name="CreateJob" options={{ title: "New Job" }} />
      <Stack.Screen name="[jobId]/edit" options={{ title: "Edit Job" }} />
      <Stack.Screen
        name="[jobId]/[paycycleId]/[shiftId]/index"
        options={{ title: "Edit Shift" }}
      />
    </Stack>
  );
};

export default Home;
