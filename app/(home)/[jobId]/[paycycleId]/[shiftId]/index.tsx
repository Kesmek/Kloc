import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Section from "@/components/Section";
import TextInput from "@/components/TextInput";
import TimePicker from "@/components/TimePicker";
import { useData } from "@/db/DataContext";
import useActiveDuration from "@/hooks/useActiveDuration";
import { useShiftMutation } from "@/hooks/useShiftMutation";
import { clampDuration, toNumber } from "@/utils/helpers";
import { longFormDuration } from "@/utils/shiftFunctions";
import { useSuspenseQueries } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Suspense, useEffect, useMemo, useState } from "react";
import { View, Text, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { StyleSheet } from "react-native-unistyles";

const ShiftScreen = () => {
  const {
    shiftId: sid,
    paycycleId: pid,
    jobId: jid,
  } = useLocalSearchParams<"/[jobId]/[paycycleId]/[shiftId]">();
  const shiftId = toNumber(sid);
  const paycycleId = toNumber(pid);
  const jobId = toNumber(jid);

  const { getShiftById, getJobById } = useData();
  const { updateShiftMutation, deleteShiftMutation } = useShiftMutation();

  const [shiftQuery, jobQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["shift", shiftId],
        queryFn: () => getShiftById(shiftId),
      },
      {
        queryKey: ["job", jobId],
        queryFn: () => getJobById(jobId),
      },
    ],
  });

  const shift = shiftQuery.data!;
  const job = jobQuery.data!;

  const [startTime, setStartTime] = useState(
    shift?.startTime
      ? Temporal.Instant.from(shift.startTime)
      : Temporal.Now.instant(),
  );
  const [endTime, setEndTime] = useState(
    shift?.endTime ? Temporal.Instant.from(shift.endTime) : null,
  );
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(
    shift?.breakDurationMinutes ?? 0,
  );
  const [notes, setNotes] = useState(shift?.notes ?? "");
  const [startTimeModalOpen, setStartTimeModalOpen] = useState(false);
  const [endTimeModalOpen, setEndTimeModalOpen] = useState(false);

  const [validBreak, setValidBreak] = useState(true);

  const { duration } = useActiveDuration(startTime, endTime);

  useEffect(() => {
    if (shift) {
      setNotes(shift.notes ?? "");
      setStartTime(Temporal.Instant.from(shift.startTime));
      setBreakDurationMinutes(shift.breakDurationMinutes);
      if (shift.endTime) {
        setEndTime(Temporal.Instant.from(shift.endTime));
      }
    }
  }, [shift]);

  const adjustedDuration = useMemo(
    () => duration.subtract({ minutes: breakDurationMinutes }),
    [breakDurationMinutes, duration],
  );

  useEffect(() => {
    if (endTime) {
      setValidBreak(
        breakDurationMinutes < endTime.since(startTime).round("minute").minutes,
      );
    }
  }, [breakDurationMinutes, endTime, startTime]);

  const { minShiftDurationMinutes } = job;
  const minShiftDuration = Temporal.Duration.from({
    minutes: minShiftDurationMinutes,
  });

  const onChangeStartTime = (newStart: Temporal.Instant) => {
    setStartTime(newStart);
    setStartTimeModalOpen(false);
  };

  const onChangeEndTime = (newEnd: Temporal.Instant) => {
    setEndTime(newEnd);
    setEndTimeModalOpen(false);
  };

  const onChangeNotes = (newNotes: string) => {
    setNotes(newNotes);
  };

  const onChangeBreakDuration = (newDuration: number) => {
    setBreakDurationMinutes(newDuration);
  };

  const updateShift = () => {
    updateShiftMutation.mutate({
      id: shiftId,
      startTime: startTime.toString(),
      endTime: endTime?.toString() ?? null,
      isEdited: true,
      notes,
      breakDurationMinutes,
      paycycleId,
    });
    router.back();
  };

  const deleteShift = () => {
    Alert.alert(
      "Are you sure?",
      "This action will completely delete this shift.",
      [
        {
          text: "ok",
          onPress: () => {
            deleteShiftMutation.mutate(shiftId);
            router.back();
          },
        },
        {
          text: "cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Section
          title={startTime.toLocaleString(undefined, { dateStyle: "full" })}
          style={styles.title}
        />
        <View style={styles.spaced}>
          <Section
            iconName="arrow-down-right"
            title="Start"
            style={styles.inputSection}
            titleStyle={styles.startText}
          >
            <Button
              style={[styles.dateButton, styles.startDateButton]}
              onPress={() => setStartTimeModalOpen(true)}
            >
              <Text
                style={[
                  styles.baseText,
                  styles.dateText,
                  styles.startTextSubtle,
                ]}
              >
                {startTime.toLocaleString(undefined, {
                  timeStyle: "short",
                })}
              </Text>
            </Button>
            <TimePicker
              open={startTimeModalOpen}
              date={startTime}
              minimumDate={startTime.subtract({ hours: 36 })}
              maximumDate={endTime ?? Temporal.Now.instant()}
              title={"Shift Start Time"}
              onConfirm={onChangeStartTime}
              onCancel={() => {
                setStartTimeModalOpen(false);
              }}
            />
          </Section>
          <Section
            iconName="pause"
            title="Break"
            style={styles.inputSection}
            titleStyle={styles.breakTextSubtle}
          >
            <View style={styles.horizontal}>
              <TextInput
                style={[styles.breakInput, styles.breakTextSubtle]}
                defaultValue={breakDurationMinutes.toString()}
                onChangeText={(text) => onChangeBreakDuration(toNumber(text))}
                inputMode="numeric"
                maxLength={3}
              />
              <Text style={[styles.floatingText, styles.secondaryText]}>
                mins
              </Text>
            </View>
          </Section>
          <Section
            iconName="arrow-up-right"
            title="End"
            style={styles.inputSection}
            titleStyle={styles.endText}
          >
            <Button
              style={[styles.dateButton, styles.endDateButton]}
              onPress={() => setEndTimeModalOpen(true)}
            >
              <Text
                style={[styles.baseText, styles.dateText, styles.endTextSubtle]}
              >
                {endTime?.toLocaleString(undefined, {
                  timeStyle: "short",
                }) || "End At.."}
              </Text>
            </Button>
            <TimePicker
              open={endTimeModalOpen}
              minimumDate={startTime}
              maximumDate={startTime.add({ hours: 36 })}
              date={endTime ?? Temporal.Now.instant()}
              title={"Shift End Time"}
              onConfirm={onChangeEndTime}
              onCancel={() => setEndTimeModalOpen(false)}
            />
          </Section>
        </View>
        {!validBreak && (
          <View style={styles.warningContainer}>
            <Icon name="alert-circle" style={styles.warning} />
            <Text style={styles.warning}>
              Break duration is longer than shift duration
            </Text>
          </View>
        )}
        <View style={styles.spaced}>
          <Section
            title="Duration"
            style={styles.inputSection}
            titleStyle={styles.durationText}
          >
            <Text style={[styles.baseText, styles.durationTextSubtle]}>
              {longFormDuration(duration)}
            </Text>
          </Section>
          <Section
            iconName="clock"
            title="Total"
            style={styles.inputSection}
            titleStyle={styles.durationText}
          >
            <Text style={[styles.baseText, styles.durationTextSubtle]}>
              {longFormDuration(
                clampDuration(adjustedDuration, minShiftDuration),
              ).concat(
                Temporal.Duration.compare(adjustedDuration, minShiftDuration) <
                  0
                  ? "*"
                  : "",
              )}
            </Text>
          </Section>
        </View>
        {Temporal.Duration.compare(adjustedDuration, minShiftDuration) < 0 && (
          <Text style={[styles.baseText, styles.secondaryText]}>
            *Rounded to minimum shift duration (
            {longFormDuration(minShiftDuration)})
          </Text>
        )}
        <Section title="Notes" titleStyle={styles.notesTitle}>
          <TextInput
            value={notes}
            placeholder="Add shift notes..."
            multiline
            onChangeText={onChangeNotes}
            style={styles.textInput}
          />
        </Section>
        <View style={[styles.horizontal, styles.buttonContainer]}>
          <Button style={[styles.button, styles.delete]} onPress={deleteShift}>
            <Icon name="trash-2" />
            <Text style={styles.buttonText}>Delete</Text>
          </Button>
          <Button style={[styles.button]} onPress={updateShift}>
            <Icon name="check" />
            <Text style={styles.buttonText}>Update</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Suspense>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing[5],
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
    gap: theme.spacing[1],
    alignItems: "center",
  },
  buttonContainer: {
    marginBlockStart: theme.spacing[2],
    gap: theme.spacing[4],
  },
  spaced: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBlockStart: theme.spacing[5],
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing[2],
    backgroundColor: theme.colors.success,
    borderWidth: theme.borderWidths.none,
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
  },
  startDateButton: {
    borderColor: theme.colors.green7,
  },
  endDateButton: {
    borderColor: theme.colors.red7,
  },
  dateButton: {
    backgroundColor: theme.colors.transparent,
    borderWidth: theme.borderWidths.thin,
    paddingVertical: theme.spacing[4],
    alignSelf: "flex-start",
    borderRadius: theme.radii["2xl"],
  },
  baseText: {
    fontSize: theme.sizes[4],
    color: theme.colors.text,
    textAlign: "center",
  },
  secondaryText: {
    color: theme.colors.textSecondary,
    fontSize: theme.sizes["3.5"],
  },
  durationText: {
    color: theme.colors.iris11,
  },
  durationTextSubtle: {
    color: theme.colors.iris12,
  },
  breakText: {},
  breakTextSubtle: {
    color: theme.colors.amber12,
  },
  delete: {
    backgroundColor: theme.colors.error,
  },
  startText: {
    color: theme.colors.green11,
  },
  startTextSubtle: {
    color: theme.colors.green12,
  },
  endText: {
    color: theme.colors.red11,
  },
  endTextSubtle: {
    color: theme.colors.red12,
  },
  textInput: {
    minHeight: theme.sizes[20],
    width: "100%",
    textAlignVertical: "top",
    marginBlockStart: theme.spacing[2],
  },
  breakInput: {
    width: theme.sizes[24],
    borderColor: theme.colors.amber7,
    textAlign: "left",
    paddingVertical: theme.spacing[4],
    fontWeight: "bold",
  },
  warningContainer: {
    alignSelf: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    alignItems: "center",
  },
  warning: {
    color: theme.colors.amber11,
  },
  floatingText: {
    position: "absolute",
    right: theme.spacing[4],
  },
  title: {
    alignSelf: "center",
    backgroundColor: theme.colors.slate2,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderEndEndRadius: theme.radii.xl,
    borderStartEndRadius: theme.radii.xl,
    textTransform: "capitalize",
  },
  inputSection: {
    alignItems: "center",
    gap: theme.spacing[1],
  },
  notesTitle: {
    marginInlineStart: theme.spacing[2],
  },
}));

export default ShiftScreen;
