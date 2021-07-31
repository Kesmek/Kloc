import RNDateTimePicker, {
  Event,
} from "@react-native-community/datetimepicker";
import { useCallback, useLayoutEffect, useState } from "react";
import { View, Text, Keyboard, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BaseButton, RectButton } from "react-native-gesture-handler";
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
import { calculateHours, formatDate } from "../../utils/functions";
import styles from "./styles";

type Props = EditPunchNavigationProps & EditPunchRouteProps;

const EditPunch = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const punchData = useAppSelector(createSelectPunchData(route.params.index));
  const formattedDate = formatDate(new Date(punchData?.date ?? 0));

  const [punchInTimePicker, setPunchInTimePicker] = useState(false);
  const [punchInTime, setPunchInTime] = useState(
    new Date(punchData?.punchIn ?? punchData?.date),
  );
  const [punchOutTimePicker, setPunchOutTimePicker] = useState(false);
  const [punchOutTime, setPunchOutTime] = useState(
    new Date(punchData?.punchOut ?? punchData?.date),
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

  const parsePunchTimes = useCallback(() => {
    const punchInDate = new Date(punchData?.date);
    const punchOutDate = new Date(punchData?.date);
    punchInDate.setHours(punchInTime.getHours(), punchInTime.getMinutes());
    punchOutDate.setHours(punchOutTime.getHours(), punchOutTime.getMinutes());

    dispatch(
      setPunchIn({
        index: route.params.index,
        date: punchInDate.getTime(),
      }),
    );

    dispatch(
      setPunchOut({
        index: route.params.index,
        date: punchOutDate.getTime(),
      }),
    );

    navigation.goBack();
  }, [
    dispatch,
    navigation,
    punchData?.date,
    punchInTime,
    punchOutTime,
    route.params.index,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formattedDate.dayOfWeek,
    });
  }, [formattedDate.dayOfWeek, navigation, parsePunchTimes]);

  return (
    <BaseButton
      style={styles.root}
      onPress={Keyboard.dismiss}
      rippleColor={"transparent"}
    >
      <Text
        style={styles.date}
      >{`${formattedDate.day}${formattedDate.suffix} ${formattedDate.month}, ${formattedDate.year}`}</Text>
      <View style={styles.punchContainer}>
        <Text style={styles.punchText}>Punch In</Text>
        <Icon
          name={"login"}
          size={32}
          style={{
            color: colors.SECONDARY_GREEN,
          }}
        />
        <Text style={styles.time} onPress={() => setPunchInTimePicker(true)}>
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
          style={[styles.time, { backgroundColor: colors.SECONDARY_RED }]}
          onPress={() => setPunchOutTimePicker(true)}
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
          value={punchInTime}
          onChange={(_: Event, date?: Date) => handleChangePunchInTime(date)}
        />
      )}
      {punchOutTimePicker && (
        <RNDateTimePicker
          mode={"time"}
          value={punchOutTime}
          onChange={(_: Event, date?: Date) => handleChangePunchOutTime(date)}
        />
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <RectButton
          style={[styles.button, { backgroundColor: colors.PRIMARY_RED }]}
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
          <Icon name={"close"} size={40} />
        </RectButton>
        <RectButton style={styles.button} onPress={parsePunchTimes}>
          <Icon name={"done"} size={40} />
        </RectButton>
      </View>
    </BaseButton>
  );
};

export default EditPunch;
