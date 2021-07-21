import { useCallback, useLayoutEffect, useState } from "react";
import { View, Text, Keyboard, Alert } from "react-native";
import {
  TextInput,
  BorderlessButton,
  BaseButton,
  RectButton,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  createSelectPunchData,
  removeDate,
  setPunchIn,
  setPunchOut,
} from "../../redux/punches";
import {
  EditPunchNavigationProps,
  EditPunchRouteProps,
} from "../../types/navigation";
import { colors } from "../../utils/constants";
import { formatDate } from "../../utils/functions";
import styles from "./styles";

type Props = EditPunchNavigationProps & EditPunchRouteProps;

const EditPunch = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const punchData = useAppSelector(createSelectPunchData(route.params.index));
  const formattedDate = formatDate(new Date(punchData?.date ?? 0));

  const [punchInString, setPunchInString] = useState(
    formatDate(new Date(punchData?.punchIn ?? 0)).time,
  );
  const [punchOutString, setPunchOutString] = useState(
    formatDate(new Date(punchData?.punchOut ?? 0)).time,
  );

  const handleChangePunchIn = (text: string) => {
    setPunchInString(text);
  };

  const handleChangePunchOut = (text: string) => {
    setPunchOutString(text);
  };

  const parsePunchTimes = useCallback(() => {
    const punchInDate = new Date();
    const punchOutDate = new Date();
    const [punchInHours, punchInMinutes] = punchInString
      .split(":")
      .map((string) => parseInt(string));
    const [punchOutHours, punchOutMinutes] = punchOutString
      .split(":")
      .map((string) => parseInt(string));

    if (punchInHours && punchInMinutes) {
      punchInDate.setHours(punchInHours, punchInMinutes);
      dispatch(
        setPunchIn({
          index: route.params.index,
          date: punchInDate.getTime().toString(),
        }),
      );
    }

    if (punchOutHours && punchOutMinutes) {
      punchOutDate.setHours(punchOutHours, punchOutMinutes);
      dispatch(
        setPunchOut({
          index: route.params.index,
          date: punchOutDate.getTime().toString(),
        }),
      );
    }

    navigation.goBack();
  }, [dispatch, navigation, punchInString, punchOutString, route.params.index]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <BorderlessButton onPress={parsePunchTimes} borderless={true}>
          <Icon name={"done"} color={colors.PRIMARY_WHITE} size={28} />
        </BorderlessButton>
      ),
      headerTitle: formattedDate.dayOfWeek,
    });
  }, [formattedDate.dayOfWeek, navigation, parsePunchTimes]);

  return (
    <BaseButton
      style={styles.root}
      onPress={() => Keyboard.dismiss()}
      rippleColor={"transparent"}
    >
      <Text
        style={styles.date}
      >{`${formattedDate.day}${formattedDate.suffix} ${formattedDate.month} ${formattedDate.year}`}</Text>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <View style={styles.punchContainer}>
          <Text style={styles.punchText}>Punch In</Text>
          <TextInput
            value={punchInString}
            onChangeText={handleChangePunchIn}
            style={styles.punchInput}
            maxLength={5}
          />
        </View>
        <View style={styles.punchContainer}>
          <Text style={[styles.punchText, { color: colors.RED }]}>
            Punch Out
          </Text>
          <TextInput
            value={punchOutString}
            onChangeText={handleChangePunchOut}
            style={styles.punchInput}
            maxLength={5}
          />
        </View>
      </View>
      <RectButton
        style={{
          backgroundColor: "red",
          height: 50,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
        rippleColor={"#505050"}
        onPress={() =>
          Alert.alert(
            "Delete this punch?",
            "This action is irreversible, do you want to continue?",
            [
              {
                text: "Yes",
                onPress: () => {
                  dispatch(removeDate(route.params.index));
                  navigation.goBack();
                },
              },
              {
                text: "No",
              },
            ],
          )
        }
      >
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>DELETE</Text>
      </RectButton>
    </BaseButton>
  );
};

export default EditPunch;
