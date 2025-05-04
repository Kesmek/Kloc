import Icon from "@/components/Icon";
import Separator from "@/components/Separator";
import Shift from "@/components/ShiftCard";
import { toNumber } from "@/utils/helpers";
import {
  filterCompleteShift,
  filterOngoingShift,
  getPaycycleStats,
} from "@/utils/shiftFunctions";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";
import { useData } from "@/db/DataContext";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useShiftMutation } from "@/hooks/useShiftMutation";
import DateTimePicker from "@/components/DateTimePicker";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

const PaycycleScreen = () => {
  const { jobId: jid, paycycleId: pcid } =
    useLocalSearchParams<"/[jobId]/[paycycleId]">();

  const { fetchShifts, fetchPaycycleStatsById } = useData();

  const jobId = toNumber(jid);
  const paycycleId = toNumber(pcid);

  const [shiftsQuery, paycyclesQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["shifts", paycycleId],
        queryFn: () => fetchShifts(paycycleId),
      },
      {
        queryKey: ["paycycleStats", jobId, paycycleId],
        queryFn: () => fetchPaycycleStatsById(jobId, paycycleId), // Fetch function using Drizzle
      },
    ],
  });

  const shifts = shiftsQuery.data;
  const paycycleStats = paycyclesQuery.data!;

  const { createShiftMutation, updateShiftMutation } = useShiftMutation();

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [ongoingShift, setOngoingShift] = useState(() =>
    shifts.find(filterOngoingShift),
  );

  useEffect(() => {
    setOngoingShift(shifts.find(filterOngoingShift));
  }, [shifts]);

  const {
    name,
    startDate,
    breakDurationMinutes,
    overtimeThresholdMinutes,
    overtimePeriodDays,
    minShiftDurationMinutes,
    timezone,
  } = paycycleStats;

  const renderHeader = () => {
    const completeShifts = shifts.filter(filterCompleteShift) ?? [];

    const {
      totalRegularHours,
      totalovertimeHours,
      totalWeekOneHours,
      totalWeekTwoHours,
    } = getPaycycleStats(
      completeShifts,
      overtimePeriodDays,
      overtimeThresholdMinutes,
      breakDurationMinutes,
      Temporal.PlainDate.from(startDate),
      timezone,
    );

    return (
      <View style={styles.header}>
        <View style={styles.vertical}>
          <Button style={styles.headerButton} onPress={router.back}>
            <Icon name="calendar" style={styles.headerSecondaryText} />
            <Text style={styles.headerSecondaryText}>
              {`${Temporal.PlainDate.from(paycycleStats.startDate).toLocaleString(undefined, { month: "short", day: "numeric" })} - ${Temporal.PlainDate.from(paycycleStats.endDate).toLocaleString(undefined, { month: "short", day: "numeric" })}`}
            </Text>
          </Button>
        </View>
        <View style={styles.vertical}>
          <Text style={styles.headerText}>
            {"Week 1: "}
            <Text style={styles.bold}>{`${totalWeekOneHours}H`}</Text>
          </Text>
          <Text style={styles.headerText}>
            {"Week 2: "}
            <Text style={styles.bold}>{`${totalWeekTwoHours}H`}</Text>
          </Text>
        </View>
        <View style={styles.vertical}>
          <Text style={styles.headerText}>
            {"Standard: "}
            <Text style={styles.bold}>{totalRegularHours.concat("H")}</Text>
          </Text>
          <Text style={styles.headerText}>
            {"Overtime: "}
            <Text style={styles.bold}>{totalovertimeHours.concat("H")}</Text>
          </Text>
        </View>
      </View>
    );
  };

  const handlePressImmediate = async () => {
    const now = Temporal.Now.instant();
    await handlePressScheduled(now, false);
  };

  const handlePressScheduled = async (
    instant: Temporal.Instant,
    isEdited = true,
  ) => {
    if (ongoingShift) {
      updateShiftMutation.mutate({
        ...ongoingShift,
        isEdited,
        endTime: instant.toString(),
      });
      setOngoingShift(undefined);
    } else {
      createShiftMutation.mutate({
        paycycleId,
        startTime: instant.toString(),
        isEdited,
        breakDurationMinutes: paycycleStats.breakDurationMinutes,
      });
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Stack.Screen
        options={{
          title: name,
        }}
      />
      <FlatList
        data={shifts.filter(filterCompleteShift)}
        renderItem={({ item }) => (
          <Shift
            shift={item}
            minShiftDurationMins={minShiftDurationMinutes}
            breakDurationMins={breakDurationMinutes}
            ongoing={false}
            jobId={jobId}
          />
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={() =>
          !ongoingShift && <Text style={styles.emptyText}>No shifts yet</Text>
        }
        ListHeaderComponent={renderHeader}
        style={styles.flatlist}
      />
      <DateTimePicker
        open={dateModalOpen}
        title={"Select Date"}
        minimumDate={
          ongoingShift
            ? Temporal.Instant.from(ongoingShift.startTime)
                .toZonedDateTimeISO(paycycleStats.timezone)
                .toPlainDateTime()
            : Temporal.PlainDateTime.from(paycycleStats.startDate)
        }
        maximumDate={
          ongoingShift
            ? Temporal.Instant.from(ongoingShift.startTime)
                .toZonedDateTimeISO(paycycleStats.timezone)
                .toPlainDateTime()
                .add({ hours: 36 })
            : Temporal.PlainDate.from(paycycleStats.endDate)
                .toPlainDateTime()
                .with({ hour: 23, minute: 59 })
        }
        date={Temporal.Now.plainDateTimeISO()}
        onConfirm={(date) => {
          handlePressScheduled(
            date.toZonedDateTime(paycycleStats.timezone).toInstant(),
          );
          setDateModalOpen(false);
        }}
        onCancel={() => {
          setDateModalOpen(false);
        }}
      />
      <View style={styles.bottomContainer}>
        {ongoingShift && (
          <Shift
            shift={ongoingShift}
            minShiftDurationMins={minShiftDurationMinutes}
            breakDurationMins={breakDurationMinutes}
            jobId={jobId}
            ongoing
          />
        )}
        <View style={styles.buttonContainer}>
          <Button
            style={[
              styles.button,
              ongoingShift ? styles.endButton : styles.startButton,
            ]}
            onPress={() => setDateModalOpen(true)}
          >
            <Icon
              name="clock"
              style={[
                styles.icon,
                ongoingShift ? styles.endButtonText : styles.startButtonText,
              ]}
            />
            <Text
              style={[
                styles.buttonText,
                ongoingShift ? styles.endButtonText : styles.startButtonText,
              ]}
            >
              {ongoingShift ? "End At..." : "Start At..."}
            </Text>
          </Button>
          {Temporal.PlainDate.compare(
            paycycleStats.endDate,
            Temporal.Now.plainDateISO(),
          ) > 0 && (
            <Button
              style={[
                styles.button,
                ongoingShift ? styles.endButton : styles.startButton,
              ]}
              onPress={handlePressImmediate}
            >
              <Icon
                name="clock"
                style={[
                  styles.icon,
                  ongoingShift ? styles.endButtonText : styles.startButtonText,
                ]}
              />
              <Text
                style={[
                  styles.buttonText,
                  ongoingShift ? styles.endButtonText : styles.startButtonText,
                ]}
              >
                {ongoingShift ? "End" : "Start"}
              </Text>
            </Button>
          )}
        </View>
      </View>
    </Suspense>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  button: {
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing[1],
    paddingVertical: theme.spacing[4],
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: theme.sizes[56],
  },
  startButton: {
    borderColor: theme.colors.green7,
    borderWidth: theme.borderWidths.thin,
    backgroundColor: theme.colors.green5,
  },
  endButton: {
    borderColor: theme.colors.red7,
    borderWidth: theme.borderWidths.thin,
    backgroundColor: theme.colors.red5,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: theme.sizes[5],
    color: theme.button.base.color,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[5],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
  },
  horizontal: {
    flexDirection: "row",
  },
  headerText: {
    color: theme.colors.text,
    paddingVertical: theme.spacing[1],
  },
  headerSecondaryText: {
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  header: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.slate2,
    borderBottomWidth: theme.borderWidths.thin,
    borderColor: theme.colors.background,
    paddingHorizontal: theme.spacing[3],
  },
  bold: {
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: theme.sizes[5],
    color: theme.colors.text,
    alignSelf: "center",
  },
  headerButton: {
    flex: 1,
    paddingHorizontal: theme.spacing[3],
    alignItems: "center",
    height: "100%",
    gap: theme.spacing[2],
    backgroundColor: theme.colors.transparent,
  },
  flatlist: {},
  vertical: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  bottomContainer: {
    backgroundColor: theme.colors.slate2,
    paddingBlockEnd: rt.insets.bottom,
  },
  icon: {
    color: theme.button.base.color,
  },
  endButtonText: {
    color: theme.colors.red11,
  },
  startButtonText: {
    color: theme.colors.green11,
  },
}));

export default PaycycleScreen;
