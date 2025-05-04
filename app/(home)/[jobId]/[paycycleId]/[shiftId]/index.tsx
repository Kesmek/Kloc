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
import { View, Text } from "react-native";
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
    deleteShiftMutation.mutate(shiftId);
    router.back();
  };

  return (
    <Suspense fallback={<Loading />}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Section
          title={startTime.toLocaleString(undefined, { dateStyle: "full" })}
          style={styles.selfAlign}
        />
        <View style={styles.spaced}>
          <Section title="Start" style={styles.inputSection}>
            <Button
              style={[styles.dateButton, styles.startDateButton]}
              onPress={() => setStartTimeModalOpen(true)}
            >
              <Text style={[styles.baseText, styles.dateText]}>
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
          <Section title="Break" style={styles.inputSection}>
            <View style={styles.horizontal}>
              <TextInput
                style={styles.breakInput}
                defaultValue={breakDurationMinutes.toString()}
                onChangeText={(text) => onChangeBreakDuration(toNumber(text))}
                inputMode="numeric"
                maxLength={3}
              />
              <Text style={styles.floatingText}>mins</Text>
            </View>
          </Section>
          <Section title="End" style={styles.inputSection}>
            <Button
              style={[styles.dateButton, styles.endDateButton]}
              onPress={() => setEndTimeModalOpen(true)}
            >
              <Text style={[styles.baseText, styles.dateText]}>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Section title="Duration">
              <Text style={[styles.baseText, styles.durationText]}>
                {longFormDuration(duration)}
              </Text>
            </Section>
          </View>
          <View>
            <Section title="Break">
              <Text style={[styles.baseText, styles.breakText]}>
                {longFormDuration(
                  Temporal.Duration.from({ minutes: breakDurationMinutes }),
                )}
              </Text>
            </Section>
          </View>
          <View>
            <Section title="Total">
              <Text style={[styles.baseText, styles.durationText]}>
                {longFormDuration(
                  clampDuration(adjustedDuration, minShiftDuration),
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
    padding: theme.spacing[2],
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
    borderColor: theme.colors.success,
  },
  dateButton: {
    backgroundColor: theme.colors.transparent,
    borderWidth: theme.borderWidths.thin,
    paddingVertical: theme.spacing[4],
    alignSelf: "flex-start",
    borderRadius: theme.radii["2xl"],
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
    color: theme.colors.iris12,
  },
  breakText: {
    color: theme.colors.amber12,
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
  breakInput: {
    width: theme.sizes[24],
    borderColor: theme.colors.amber7,
    textAlign: "left",
    paddingVertical: theme.spacing[4],
  },
  warningContainer: {
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
    color: theme.colors.textSecondary,
    fontSize: theme.sizes[4],
  },
  selfAlign: {
    alignSelf: "center",
  },
  inputSection: {
    alignItems: "center",
    gap: theme.spacing[1],
  },
}));

export default ShiftScreen;
