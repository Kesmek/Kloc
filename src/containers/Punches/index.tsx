import { useLayoutEffect } from "react";
import { Text, View, ListRenderItem, Alert } from "react-native";
import { BaseButton, FlatList, RectButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  addDate,
  createSelectPunches,
  PunchRecord,
  punchIn,
  punchOut,
} from "../../redux/punches";
import { PunchesNavigationProps } from "../../types/navigation";
import { colors } from "../../utils/constants";
import { calculateHours, formatDate } from "../../utils/functions";
import styles from "./styles";

const Punches = ({ navigation }: PunchesNavigationProps) => {
  const data = useAppSelector(createSelectPunches());
  const dispatch = useAppDispatch();

  const createDay = () => {
    const today = new Date();
    const matches = data.filter((date) => {
      const day = new Date(date.date);
      return day.getDate() === today.getDate();
    });

    if (!matches.length) {
      dispatch(addDate());
    } else {
      Alert.alert(
        "Work day already exists for today",
        "You've already added a work day for today, try again on another day.",
        [
          {
            text: "ok",
          },
        ],
      );
    }
  };

  const renderItem: ListRenderItem<PunchRecord> = ({ item, index }) => {
    const rawDate = new Date(item.date);
    const rawPunchIn = new Date(item.punchIn ?? 0);
    const rawPunchOut = new Date(item.punchOut ?? 0);
    const clockIn = formatDate(rawPunchIn);
    const clockOut = formatDate(rawPunchOut);
    const date = formatDate(rawDate);

    return (
      <RectButton
        style={styles.itemContainer}
        onPress={() => {
          navigation.navigate("Edit Punch", { index });
        }}
      >
        <View style={styles.dateContainer}>
          <Text
            style={styles.date}
          >{`${date.day}${date.suffix} ${date.month}`}</Text>
          <Text style={styles.dayOfWeek}>{date.dayOfWeek}</Text>
        </View>
        <View style={styles.punchContainer}>
          <RectButton
            style={styles.punchItem}
            onPress={() => {
              if (rawPunchIn.getTime() === 0) {
                dispatch(punchIn(index));
              }
            }}
          >
            <Icon
              name={"login"}
              size={32}
              style={{ color: colors.SECONDARY_GREEN }}
            />
            <Text style={styles.time}>{clockIn.time}</Text>
          </RectButton>
          <RectButton
            style={styles.punchItem}
            onPress={() => {
              if (rawPunchOut.getTime() === 0) {
                dispatch(punchOut(index));
              }
            }}
          >
            <Icon
              name={"logout"}
              size={32}
              style={{ color: colors.SECONDARY_RED }}
            />
            <Text style={styles.time}>{clockOut.time}</Text>
          </RectButton>
          <View style={styles.punchItem}>
            <Icon
              name={"schedule"}
              size={32}
              style={{ color: colors.SECONDARY_PURPLE }}
            />
            <Text style={styles.time}>
              {calculateHours(rawPunchIn.getTime(), rawPunchOut.getTime())}
            </Text>
          </View>
        </View>
      </RectButton>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <BaseButton
          onPress={() => console.log("more")}
          style={{ borderRadius: 20 }}
        >
          <Icon name={"more-vert"} color={colors.PRIMARY_WHITE} size={28} />
        </BaseButton>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.date + item.punchIn}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      />
      <BaseButton
        style={styles.newDateButton}
        onPress={createDay}
        // entering={ZoomIn.springify()}
        // exiting={ZoomOut}
      >
        <Icon name={"add"} color={colors.PRIMARY_WHITE} size={50} />
      </BaseButton>
    </View>
  );
};

export default Punches;
