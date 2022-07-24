import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { format } from "date-fns";
import IconButton from "../components/IconButton";
import { Colors } from "../utils/constants";
import { RectButton } from "react-native-gesture-handler";
import { memo } from "react";

type Props = {
  onPress: () => void;
  onEndShift: () => void;
  start: number | Date;
  end?: number | Date;
  edited: boolean;
  notes?: string;
  duration?: string;
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  enabled?: boolean;
};

const ShiftEntry = (
  {
    onPress,
    onEndShift,
    start,
    end,
    notes,
    edited,
    duration,
    style,
    textStyle,
    enabled = true,
  }: Props) => {
  const formatString = (string?: string) => {
    if (!string) {
      return "";
    }
    const append = string.length > 50 ? "..." : "";
    return string.substring(
      0,
      50,
    )
    .concat(append);
  };

  return (
    <RectButton
      style={style ?? styles.shift}
      onPress={onPress}
      enabled={enabled}
      disallowInterruption={true}
    >
      <View style={styles.dateWrapper}>
        <Text style={[styles.shiftDate, textStyle]}>{format(
          start,
          `LLL do, EEE.${edited ? "*" : ""}`,
        )}</Text>
        <Text style={[styles.notes, textStyle]} numberOfLines={2}>{formatString(
          notes)}</Text>
      </View>
      <View style={[styles.dateWrapper, { flexDirection: "row", flex: 1.25 }]}>
        <IconButton
          name="add-alarm"
          size={30}
          color={Colors.GREEN}
          enabled={false}
          style={styles.shiftButton}
          disabledStyle={styles.disabledShiftEnd}
        >
          <Text
            style={[styles.time, textStyle]}
          >{format(
            start,
            "h:mma",
          )}</Text>
        </IconButton>
        <IconButton
          name="alarm-on"
          size={30}
          color={Colors.RED}
          enabled={!end}
          onPress={onEndShift}
          style={styles.shiftButton}
          disabledStyle={styles.disabledShiftEnd}
        >
          <Text
            style={[styles.time, textStyle]}
          >{end ? format(
            end,
            "h:mma",
          ) : duration}</Text>
        </IconButton>
        {end && (
          <IconButton
            name="schedule"
            size={30}
            color={Colors.SECONDARY_LIGHT}
            enabled={false}
            style={styles.shiftButton}
            disabledStyle={styles.disabledShiftEnd}
          >
            <Text
              style={[styles.time, textStyle]}
            >{duration}</Text>
          </IconButton>
        )}
      </View>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  shift: {
    flex: 1,
    flexDirection: "row",
    height: 70,
    padding: 5,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY_DARK,
  },
  shiftDate: {
    color: Colors.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateWrapper: {
    flex: 1,
  },
  shiftButton: {
    flex: 1,
    margin: 2,
    borderRadius: 10,
    borderColor: Colors.RED,
    borderWidth: 1,
  },
  time: {
    fontSize: 12,
    borderRadius: 5,
    paddingHorizontal: 2,
    fontWeight: "bold",
    color: Colors.TEXT_LIGHT,
    borderColor: Colors.PRIMARY,
  },
  notes: {
    marginHorizontal: 5,
  },
  disabledShiftEnd: {
    borderWidth: 0,
  },
});

export default memo(ShiftEntry);
