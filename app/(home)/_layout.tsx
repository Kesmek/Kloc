import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        animation: "slide_from_right",
        animationDuration: 250,
      }}
    />
  );
};

export default HomeLayout;
