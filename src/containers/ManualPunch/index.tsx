import { CustomPunchNavigationProps } from "../../types/navigation";
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
import { addCompletePunch, createSelectYearData } from "../../redux/punches";
import { colors } from "../../utils/constants";
import { calculateHours, formatDate } from "../../utils/functions";
import styles from "../EditPunch/styles";

const ManualPunch = ({ navigation }: CustomPunchNavigationProps) => {
  const [punchInDatePicker, setPunchInDatePicker] = useState(true);
  const [punchInTimePicker, setPunchInTimePicker] = useState(false);
  const [punchInTime, setPunchInTime] = useState(new Date());
  const [punchOutTimePicker, setPunchOutTimePicker] = useState(false);
  const [punchOutDatePicker, setPunchOutDatePicker] = useState(false);
  const [punchOutTime, setPunchOutTime] = useState(new Date());
  const [additionalText, setAdditionalText] = useState<string | undefined>();

  const punchData = useAppSelector(
    createSelectYearData(punchInTime.getFullYear()),
  );
  const dispatch = useAppDispatch();

  const handleChangePunchInTime = (date?: Date) => {
    const newDate = date ?? punchInTime;

    setPunchInTimePicker(false);
    setPunchInTime(newDate);
    date && setPunchOutDatePicker(true);
  };

  const handleChangePunchOutTime = (date?: Date) => {
    const newDate = date ?? punchOutTime;

    setPunchOutTimePicker(false);
    setPunchOutTime(newDate);
  };

  const handleChangePunchInDate = (date?: Date) => {
    const newDate = date ?? punchInTime;

    setPunchInDatePicker(false);
    setPunchInTime(newDate);
    date && setPunchInTimePicker(true);
  };

  const handleChangePunchOutDate = (date?: Date) => {
    const newDate = date ?? punchOutTime;

    setPunchOutDatePicker(false);
    setPunchOutTime(newDate);
    date && setPunchOutTimePicker(true);
  };

  const handleChangeText = (text: string) => {
    setAdditionalText(text);
  };

  const parsePunchTimes = useCallback(() => {
    if (
      punchData[punchInTime.getMonth()]?.find(
        (day) => new Date(day.date).getDate() === punchInTime.getDate(),
      )
    ) {
      Alert.alert(
        "Punch Already Exists",
        "A punch record for this date already exists, please edit that punch manually if you wish to change it's punch in/out time",
        [
          {
            text: "ok",
          },
        ],
      );
    } else {
      dispatch(
        addCompletePunch({
          date: punchInTime.getTime(),
          notes: additionalText,
          punchIn: punchInTime.getTime(),
          punchOut: punchOutTime.getTime(),
        }),
      );
      navigation.goBack();
    }
  }, [
    additionalText,
    dispatch,
    navigation,
    punchData,
    punchInTime,
    punchOutTime,
  ]);

  const deletePunch = () =>
    Alert.alert(
      "Cancel creating this punch?",
      "This action is irreversible, do you want to continue?",
      [
        {
          style: "cancel",
          text: "No",
        },
        {
          onPress: () => {
            navigation.goBack();
          },
          style: "destructive",
          text: "Yes",
        },
      ],
    );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Manual Punch`,
    });
  }, [navigation]);

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
        <Text onPress={() => setPunchInDatePicker(true)} style={styles.time}>
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
          onPress={() => setPunchOutDatePicker(true)}
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
          {calculateHours(punchInTime, punchOutTime)}
        </Text>
      </View>
      {punchInDatePicker && (
        <RNDateTimePicker
          maximumDate={new Date()}
          mode={"date"}
          onChange={(_: Event, date?: Date) => handleChangePunchInDate(date)}
          value={punchInTime}
        />
      )}
      {punchInTimePicker && (
        <RNDateTimePicker
          mode={"time"}
          onChange={(_: Event, date?: Date) => handleChangePunchInTime(date)}
          value={punchInTime}
        />
      )}
      {punchOutDatePicker && (
        <RNDateTimePicker
          maximumDate={
            new Date(
              punchInTime.getFullYear(),
              punchInTime.getMonth(),
              punchInTime.getDate() + 1,
            )
          }
          minimumDate={punchInTime}
          mode={"date"}
          onChange={(_: Event, date?: Date) => handleChangePunchOutDate(date)}
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
          <Icon name={"close"} size={40} />
        </RectButton>
        <RectButton onPress={parsePunchTimes} style={styles.button}>
          <Icon name={"done"} size={40} />
        </RectButton>
      </View>
    </BaseButton>
  );
};

export default ManualPunch;
