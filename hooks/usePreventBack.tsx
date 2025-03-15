import {
  HeaderBackButton,
  HeaderBackButtonProps,
} from "@react-navigation/elements";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, BackHandler } from "react-native";

interface PreventBackProps {
  message?: string;
  title?: string;
}

const usePreventBack = ({
  message = "You have unsaved changes",
  title = "Go back?",
}: PreventBackProps = {}) => {
  const [preventBack, setPreventBack] = useState(false);
  const navigation = useNavigation();

  const backAction = useCallback(() => {
    if (preventBack) {
      Alert.alert(title, message, [
        { text: "cancel", onPress: () => {}, style: "cancel" },
        { text: "YES", onPress: router.back },
      ]);
      return true;
    }
    router.back();
    return true;
  }, [message, preventBack, title]);

  const forceBack = () => {
    router.back();
  };

  useFocusEffect(
    useCallback(() => {
      const listener = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      navigation.setOptions({
        headerLeft: (props: HeaderBackButtonProps) => (
          <HeaderBackButton {...props} onPress={backAction} />
        ),
      });
      return () => listener.remove();
    }, [backAction, navigation]),
  );

  return { setPreventBack, forceBack };
};

export default usePreventBack;
