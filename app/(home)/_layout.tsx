import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import { Stack, router } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => {
          return (
            props.canGoBack && (
              <NativePlatformPressable
                borderless
                onPress={router.back}
                hitSlop={20}
              >
                <Icon name="arrow-left" />
              </NativePlatformPressable>
            )
          );
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        animation: "slide_from_right",
        animationDuration: 250,
      }}
    />
  );
};

export default HomeLayout;
