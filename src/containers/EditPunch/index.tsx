import RNDateTimePicker, {
  Event,
} from "@react-native-community/datetimepicker";
import { useCallback, useLayoutEffect, useState } from "react";
import { View, Text, Keyboard, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  BaseButton,
  RectButton,
  TextInput,
} from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  createSelectPunchData,
  removeDate,
  setNotes,
  setPunchIn,
  setPunchOut,
} from "../../redux/punches";
import {
  EditPunchNavigationProps,
  EditPunchRouteProps,
} from "../../types/navigation";
import { colors } from "../../utils/constants";
import { calculateHours, formatDate } from "../../utils/functions";
import styles from "./styles";

type Props = EditPunchNavigationProps & EditPunchRouteProps;

const EditPunch = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const punchData = useAppSelector(createSelectPunchData(route.params.index));
  const formattedDate = formatDate(new Date(punchData?.date ?? 0));

  const [punchInTimePicker, setPunchInTimePicker] = useState(false);
  const [punchInTime, setPunchInTime] = useState(
    new Date(punchData?.punchIn ?? 0),
  );
  const [punchOutTimePicker, setPunchOutTimePicker] = useState(false);
  const [punchOutTime, setPunchOutTime] = useState(
    new Date(punchData?.punchOut ?? 0),
  );
  const [additionalText, setAdditionalText] = useState<string | undefined>(
    punchData?.notes,
  );

  const handleChangePunchInTime = (date?: Date) => {
    const newDate = date ?? punchInTime;

    setPunchInTimePicker(false);
    setPunchInTime(newDate);
  };

  const handleChangePunchOutTime = (date?: Date) => {
    const newDate = date ?? punchOutTime;

    setPunchOutTime(newDate);
    setPunchOutTimePicker(false);
  };

  const handleChangeText = (text: string) => {
    setAdditionalText(text);
  };

  const deletePunch = () =>
    Alert.alert(
      "Delete this punch?",
      "This action is irreversible, do you want to continue?",
      [
        {
          style: "cancel",
          text: "No",
        },
        {
          onPress: () => {
            dispatch(removeDate(route.params.index));
            navigation.goBack();
          },
          style: "destructive",
          text: "Yes",
        },
      ],
    );

  const parsePunchTimes = useCallback(() => {
    const punchInDate = new Date(punchData?.date);
    const punchOutDate = new Date(punchData?.date);
    punchInDate.setHours(punchInTime.getHours(), punchInTime.getMinutes());
    punchOutDate.setHours(punchOutTime.getHours(), punchOutTime.getMinutes());

    dispatch(
      setPunchIn({
        date: punchInDate.getTime(),
        index: route.params.index,
      }),
    );

    dispatch(
      setPunchOut({
        date: punchOutDate.getTime(),
        index: route.params.index,
      }),
    );

    dispatch(
      setNotes({
        index: route.params.index,
        notes: additionalText,
      }),
    );

    navigation.goBack();
  }, [
    additionalText,
    dispatch,
    navigation,
    punchData?.date,
    punchInTime,
    punchOutTime,
    route.params.index,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${formattedDate.dayOfWeek}, ${formattedDate.month} ${formattedDate.day}${formattedDate.suffix}`,
    });
  }, [
    formattedDate.day,
    formattedDate.dayOfWeek,
    formattedDate.month,
    formattedDate.suffix,
    navigation,
  ]);

  return (
    <BaseButton
      onPress={Keyboard.dismiss}
      rippleColor={"transparent"}
      style={styles.root}
    >
      <View style={styles.punchContainer}>
        <Text style={styles.punchText}>Punch In</Text>
        <Icon
          name={"login"}
          size={32}
          style={{
            color: colors.SECONDARY_GREEN,
          }}
        />
        <Text onPress={() => setPunchInTimePicker(true)} style={styles.time}>
          {formatDate(punchInTime).time}
        </Text>
      </View>
      <View style={styles.punchContainer}>
        <Text style={styles.punchText}>Punch Out</Text>
        <Icon
          name={"logout"}
          size={32}
          style={{
            color: colors.SECONDARY_RED,
          }}
        />
        <Text
          onPress={() => setPunchOutTimePicker(true)}
          style={[styles.time, { backgroundColor: colors.SECONDARY_RED }]}
        >
          {formatDate(punchOutTime).time}
        </Text>
      </View>
      <View style={styles.punchContainer}>
        <Text style={styles.punchText}>Hours Worked</Text>
        <Icon
          name={"schedule"}
          size={32}
          style={{
            color: colors.SECONDARY_PURPLE,
          }}
        />
        <Text
          style={[styles.time, { backgroundColor: colors.SECONDARY_PURPLE }]}
        >
          {calculateHours(punchInTime.getTime(), punchOutTime.getTime())}
        </Text>
      </View>
      {punchInTimePicker && (
        <RNDateTimePicker
          mode={"time"}
          onChange={(_: Event, date?: Date) => handleChangePunchInTime(date)}
          value={punchInTime}
        />
      )}
      {punchOutTimePicker && (
        <RNDateTimePicker
          mode={"time"}
          onChange={(_: Event, date?: Date) => handleChangePunchOutTime(date)}
          value={punchOutTime}
        />
      )}
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: colors.PRIMARY_WHITE, fontSize: 20 }}>Notes</Text>
        <TextInput
          multiline={true}
          onChangeText={handleChangeText}
          placeholder={"Additional information about this work day"}
          style={styles.notesInput}
          value={additionalText}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <RectButton
          onPress={deletePunch}
          style={[styles.button, { backgroundColor: colors.PRIMARY_RED }]}
        >
          <Icon name={"delete-outline"} size={40} />
        </RectButton>
        <RectButton onPress={parsePunchTimes} style={styles.button}>
          <Icon name={"done"} size={40} />
        </RectButton>
      </View>
    </BaseButton>
  );
};

export default EditPunch;
