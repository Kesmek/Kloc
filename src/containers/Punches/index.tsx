import { Text, View, ListRenderItem } from "react-native";
import {
  BaseButton,
  BorderlessButton,
  FlatList,
  RectButton,
} from "react-native-gesture-handler";
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
    dispatch(addDate());
  };

  const renderItem: ListRenderItem<PunchRecord> = ({ item, index }) => {
    const rawDate = new Date(item.date);
    const rawPunchIn = new Date(item.punchIn ?? 0);
    const rawPunchOut = new Date(item.punchOut ?? 0);
    const clockIn = formatDate(rawPunchIn);
    const clockOut = formatDate(rawPunchOut);
    const date = formatDate(rawDate);

    return (
      <View
        style={{
          backgroundColor: colors.DISABLED_WHITE,
          height: 60,
          alignItems: "center",
          paddingLeft: 15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={styles.date}
          >{`${date.day}${date.suffix} ${date.month}, ${date.year}`}</Text>
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
            <Icon name={"login"} size={32} />
            <Text style={[styles.time, { color: colors.GREEN }]}>
              {clockIn.time}
            </Text>
          </RectButton>
          <RectButton
            style={styles.punchItem}
            onPress={() => {
              if (rawPunchOut.getTime() === 0) {
                dispatch(punchOut(index));
              }
            }}
          >
            <Icon name={"logout"} size={32} />
            <Text style={[styles.time, { color: colors.RED }]}>
              {clockOut.time}
            </Text>
          </RectButton>
          <View style={styles.punchItem}>
            <Icon name={"schedule"} size={32} />
            <Text style={styles.time}>
              {calculateHours(rawPunchIn.getTime(), rawPunchOut.getTime())}
            </Text>
          </View>
          <BorderlessButton
            style={[styles.punchItem, styles.editButton]}
            onPress={() => {
              navigation.navigate("Edit Punch", { index });
            }}
          >
            <Icon name={"edit"} size={32} />
          </BorderlessButton>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      <BaseButton
        style={{
          width: 75,
          height: 75,
          backgroundColor: colors.PURPLE,
          position: "absolute",
          bottom: 50,
          right: 50,
          borderRadius: 75 / 2,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={createDay}
      >
        <Icon name={"add"} color={colors.PRIMARY_WHITE} size={50} />
      </BaseButton>
    </View>
  );
};

export default Punches;
