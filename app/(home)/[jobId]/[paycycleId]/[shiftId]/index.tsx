import DatePicker from "@/components/DatePicker";
import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Section from "@/components/Section";
import CustomTextInput from "@/components/TextInput";
import { SelectShift, shift } from "@/db/schema";
import useActiveDuration from "@/hooks/useActiveDuration";
import { useDatabase } from "@/hooks/useDatabase";
import usePreventBack from "@/hooks/usePreventBack";
import { clampDuration, toNumber } from "@/utils/helpers";
import { stringToTime } from "@/utils/shiftFunctions";
import { Stringified } from "@/utils/typescript";
import { eq } from "drizzle-orm";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Shift = () => {
  const {
    shiftId,
    startTime: start_time,
    endTime: end_time,
    notes: shiftNotes,
    minShiftDurationMins,
    breakDurationMins,
    edited,
  } = useLocalSearchParams<
    Stringified<SelectShift> & {
      shiftId: string;
      startTime: string;
      endTime: string;
      notes: string;
      minShiftDurationMins: string;
      breakDurationMins: string;
    }
  >();
  const { db } = useDatabase();
  const breakDuration = useMemo(
    () => Temporal.Duration.from({ minutes: toNumber(breakDurationMins) }),
    [breakDurationMins],
  );
  const minShiftDuration = useMemo(
    () =>
      Temporal.Duration.from({
        hours: toNumber(minShiftDurationMins) / 60,
      }),
    [minShiftDurationMins],
  );
  const { setPreventBack, forceBack } = usePreventBack();

  const [startTime, setStartTime] = useState(
    Temporal.ZonedDateTime.from(start_time!),
  );
  const [endTime, setEndTime] = useState(
    end_time ? Temporal.ZonedDateTime.from(end_time) : null,
  );
  const { duration } = useActiveDuration(startTime, endTime);
  const adjustedDuration = useMemo(
    () => duration.subtract(breakDuration),
    [breakDuration, duration],
  );

  const [notes, setNotes] = useState(shiftNotes ?? "");
  const [startTimeModalOpen, setStartTimeModalOpen] = useState(false);
  const [endTimeModalOpen, setEndTimeModalOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(edited === "true");

  const { styles } = useStyles(stylesheet);

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });

  const animatedStyles = useAnimatedStyle(() => ({
    marginBottom: keyboard.height.value,
  }));

  const onChangeStartTime = (newStart: Temporal.ZonedDateTime) => {
    setStartTime(newStart);
    setIsEdited(true);
    setStartTimeModalOpen(false);
    setPreventBack(true);
  };
  const onChangeEndTime = (newEnd: Temporal.ZonedDateTime) => {
    setEndTime(newEnd);
    setIsEdited(true);
    setEndTimeModalOpen(false);
    setPreventBack(true);
  };
  const onChangeNotes = (newNotes: string) => {
    setNotes(newNotes);
    setPreventBack(true);
  };

  const deleteShift = async () => {
    await db.delete(shift).where(eq(shift.id, toNumber(shiftId)));
    forceBack();
  };

  const updateShift = async () => {
    await db
      .update(shift)
      .set({
        startTime: startTime.toString(),
        endTime: endTime?.toString() ?? null,
        duration: endTime ? duration.toString() : null,
        edited: isEdited,
        notes,
      })
      .where(eq(shift.id, toNumber(shiftId)));
    forceBack();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Shift",
        }}
      />
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        style={animatedStyles}
      >
        <Section title="Start">
          <NativePlatformPressable
            style={[styles.dateButton, styles.startDateButton]}
            onPress={() => setStartTimeModalOpen(true)}
          >
            <View style={styles.horizontal}>
              <Text style={[styles.baseText, styles.dateText]}>
                {startTime.toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </NativePlatformPressable>
          <DatePicker
            open={startTimeModalOpen}
            date={startTime}
            minimumDate={startTime.subtract({ hours: 36 })}
            maximumDate={endTime ?? Temporal.Now.zonedDateTimeISO()}
            title={"Paycycle Start Date"}
            onConfirm={onChangeStartTime}
            onCancel={() => {
              setStartTimeModalOpen(false);
            }}
          />
        </Section>
        <Section title="End">
          <NativePlatformPressable
            style={[styles.dateButton, styles.endDateButton]}
            onPress={() => setEndTimeModalOpen(true)}
          >
            <Text style={[styles.baseText, styles.dateText]}>
              {endTime?.toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              }) || "End At.."}
            </Text>
          </NativePlatformPressable>
          <DatePicker
            open={endTimeModalOpen}
            minimumDate={startTime}
            maximumDate={startTime.add({ hours: 36 })}
            date={endTime ?? Temporal.Now.zonedDateTimeISO()}
            title={"Paycycle End Date"}
            onConfirm={onChangeEndTime}
            onCancel={() => setEndTimeModalOpen(false)}
          />
        </Section>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Section title="Duration" style={{ textAlign: "center" }}>
              <Text style={[styles.baseText, styles.durationText]}>
                {stringToTime(duration.round("seconds").toLocaleString())}
              </Text>
            </Section>
          </View>
          <View>
            <Section title="Break" style={{ textAlign: "center" }}>
              <Text style={[styles.baseText, styles.breakText]}>
                {stringToTime(breakDuration.round("seconds").toLocaleString())}
              </Text>
            </Section>
          </View>
          <View>
            <Section title="Total" style={{ textAlign: "center" }}>
              <Text style={[styles.baseText, styles.durationText]}>
                {stringToTime(
                  clampDuration(adjustedDuration, minShiftDuration)
                    .round("seconds")
                    .toLocaleString(),
                ).concat(
                  Temporal.Duration.compare(
                    adjustedDuration,
                    minShiftDuration,
                  ) < 0
                    ? "*"
                    : "",
                )}
              </Text>
            </Section>
          </View>
        </View>
        {Temporal.Duration.compare(adjustedDuration, minShiftDuration) < 0 && (
          <Text style={styles.baseText}>
            *Rounded up to minimum shift duration
          </Text>
        )}
        <Section title="Notes">
          <CustomTextInput
            value={notes}
            placeholder="Add shift notes..."
            multiline
            onChangeText={onChangeNotes}
            style={styles.textInput}
          />
        </Section>
        <View style={styles.horizontal}>
          <NativePlatformPressable
            style={[styles.button, styles.delete]}
            onPress={deleteShift}
          >
            <Icon name="trash-2" />
            <Text style={styles.buttonText}>Delete</Text>
          </NativePlatformPressable>
          <NativePlatformPressable
            style={[styles.button]}
            onPress={updateShift}
          >
            <Icon name="check" />
            <Text style={styles.buttonText}>Update</Text>
          </NativePlatformPressable>
        </View>
      </Animated.ScrollView>
    </>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: theme.spacing[2],
    gap: theme.spacing[2],
  },
  buttonText: {
    fontWeight: "500",
    fontSize: theme.sizes["4.5"],
    color: theme.colors.text,
  },
  dateText: {
    fontWeight: "500",
    color: theme.colors.text,
  },
  horizontal: {
    flexDirection: "row",
    gap: theme.spacing[4],
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing[2],
    backgroundColor: theme.colors.success,
    borderWidth: theme.borderWidths.none,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  startDateButton: {
    borderColor: theme.colors.success,
  },
  dateButton: {
    paddingVertical: theme.spacing[4],
    alignSelf: "flex-start",
  },
  endDateButton: {
    borderColor: theme.colors.error,
  },
  baseText: {
    fontSize: theme.sizes[4],
    color: theme.colors.text,
    textAlign: "center",
  },
  durationText: {
    color: theme.colors.iris11,
  },
  breakText: {
    color: theme.colors.amber11,
  },
  delete: {
    backgroundColor: theme.colors.error,
  },
  startText: {
    color: theme.colors.success,
  },
  textInput: {
    minHeight: theme.sizes[20],
    width: "100%",
    textAlignVertical: "top",
  },
}));

export default Shift;
