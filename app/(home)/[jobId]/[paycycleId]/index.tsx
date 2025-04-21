import ActiveShift from "@/components/ActiveShift";
import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Separator from "@/components/Separator";
import Shift from "@/components/ShiftCard";
import { type Job, type Paycycle, paycycle, shift } from "@/db/schema";
import { toNumber } from "@/utils/helpers";
import {
  filterCompleteShift,
  filterOngoingShift,
  getPaycycleStats,
} from "@/utils/shiftFunctions";
import type { Stringified } from "@/utils/typescript";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import DatePicker from "@/components/DatePicker";
import { StyleSheet } from "react-native-unistyles";
import { useData } from "@/db/DataContext";
import { useQuery } from "@tanstack/react-query";
import { useShiftMutation } from "@/hooks/useStartShiftMutation";

const PaycycleScreen = () => {
  const { jobId: jid, paycycleId: pcid } = useLocalSearchParams<
    "/[jobId]/[paycycleId]",
    Stringified<Job> & Stringified<Paycycle>
  >();

  const { fetchShifts, fetchPaycycleStatsById } = useData();

  const jobId = toNumber(jid);
  const paycycleId = toNumber(pcid);

  const { data: shiftsQuery, isLoading: isLoadingShifts } = useQuery({
    queryKey: ["shifts", paycycleId],
    queryFn: () => fetchShifts(paycycleId), // Fetch function using Drizzle
  });

  const { data: paycycleStats, isLoading: isLoadingPaycycle } = useQuery({
    queryKey: ["shifts", paycycleId],
    queryFn: () => fetchPaycycleStatsById(jobId, paycycleId), // Fetch function using Drizzle
  });

  const mutation = useShiftMutation();

  const name = paycycleStats?.name ?? "";
  const description = paycycleStats?.description ?? "";
  const paycycleDays = paycycleStats?.paycycleDays ?? 0;
  const breakDurationMinutes = paycycleStats?.breakDurationMinutes ?? 0;
  const overtimePeriodDays = paycycleStats?.overtimePeriodDays ?? 0;
  const overtimeThresholdMinutes = paycycleStats?.overtimeThresholdMinutes ?? 0;
  const minShiftDurationMinutes = paycycleStats?.minShiftDurationMinutes ?? 0;
  const cycleStart = paycycleStats?.startDate;
  const periodEnd = paycycleStats?.endDate;

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [ongoingShift, setOngoingShift] = useState(
    shiftsQuery?.find(filterOngoingShift),
  );

  const renderHeader = () => {
    const shifts = shiftsQuery?.filter(filterCompleteShift) ?? [];

    const {
      totalRegularHours,
      totalovertimeHours,
      totalWeekOneHours,
      totalWeekTwoHours,
    } = getPaycycleStats(
      shifts,
      overtimePeriodDays,
      overtimeThresholdMinutes,
      breakDurationMinutes,
      cycleStart,
    );

    return (
      <View style={styles.header}>
        <View style={styles.vertical}>
          <Link
            href={{
              pathname: "/[jobId]",
              params: {
                jobId,
                name,
                description,
                overtimeBoundaryMins: overtimeThresholdMinutes,
                overtimePeriod: overtimePeriodDays,
                breakDurationMins: breakDurationMinutes,
              },
            }}
            asChild
          >
            <NativePlatformPressable style={styles.headerButton} unstyled>
              <Icon name="calendar" style={styles.headerSecondaryText} />
              <Text style={styles.headerSecondaryText}>
                {`${paycycleStats?.startDate.toLocaleString()} - ${paycycleStats?.endDate.toLocaleString()}`}
              </Text>
            </NativePlatformPressable>
          </Link>
        </View>
        <View style={styles.vertical}>
          <Text style={styles.headerText}>
            {"Week 1: "}
            <Text style={styles.bold}>{totalWeekOneHours.concat("H")}</Text>
          </Text>
          <Text style={styles.headerText}>
            {"Week 2: "}
            <Text style={styles.bold}>{totalWeekTwoHours.concat("H")}</Text>
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
      mutation.mutate({
        id: ongoingShift.id,
        startTime: ongoingShift.startTime,
        isEdited,
        paycycleId,
        endTime: instant.toString(),
      });
      setOngoingShift(undefined);
    } else {
      mutation.mutate({
        paycycleId,
        startTime: instant.toString(),
        isEdited,
      });
    }
  };

  useEffect(() => {
    setOngoingShift(shiftsQuery?.find(filterOngoingShift));
  }, [shiftsQuery]);

  if (!shiftsQuery) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerRight: (props) => (
            <Link
              href={{
                pathname: "/[jobId]/edit",
                params: {
                  jobId,
                  name,
                  description,
                  overtimeBoundaryMins: overtimeThresholdMinutes,
                  overtimePeriod: overtimePeriodDays,
                  breakDurationMins: breakDurationMinutes,
                  paycycleDays,
                  minShiftDurationMins: minShiftDurationMinutes,
                },
              }}
              asChild
            >
              <NativePlatformPressable
                unstyled
                borderless
                hitSlop={10}
                {...props}
              >
                <Icon name="edit" color={props.tintColor} />
              </NativePlatformPressable>
            </Link>
          ),
          headerLeft: (props) => (
            <NativePlatformPressable
              borderless
              onPress={() => router.navigate("/")}
              hitSlop={20}
            >
              <Icon name="arrow-left" color={props.tintColor} />
            </NativePlatformPressable>
          ),
        }}
      />
      {renderHeader()}
      <View style={styles.flatlistContainer}>
        <FlatList
          data={shiftsQuery.filter((shift) => !!shift.endTime)}
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
          ListHeaderComponentStyle={styles.header}
        />
      </View>
      <DatePicker
        open={dateModalOpen}
        title={"Select Date"}
        minimumDate={
          paycycleStats?.startDate
            ? Temporal.PlainDateTime.from(paycycleStats.startDate)
            : undefined
        }
        maximumDate={Temporal.Now.plainDateTimeISO()}
        mode="datetime"
        date={Temporal.Now.plainDateTimeISO()}
        onConfirm={(date) => {
          handlePressScheduled(Temporal.Instant.from(date.toString()));
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
          <NativePlatformPressable
            style={[
              styles.button,
              ongoingShift ? styles.endButton : styles.startButton,
            ]}
            onPress={() => setDateModalOpen(true)}
          >
            <Icon name="clock" style={styles.icon} />
            <Text style={styles.buttonText}>
              {ongoingShift ? "End At..." : "Start At..."}
            </Text>
          </NativePlatformPressable>
          <NativePlatformPressable
            style={[
              styles.button,
              ongoingShift ? styles.endButton : styles.startButton,
            ]}
            onPress={handlePressImmediate}
          >
            <Icon name="clock" style={styles.icon} />
            <Text style={styles.buttonText}>
              {ongoingShift ? "End" : "Start"}
            </Text>
          </NativePlatformPressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  button: {
    flexDirection: "row",
    gap: theme.spacing[2],
    borderWidth: theme.borderWidths.none,
    paddingVertical: theme.spacing[4],
  },
  startButton: {
    backgroundColor: theme.colors.success,
  },
  endButton: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: theme.sizes[5],
    color: theme.colors.textDark,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    flexDirection: "row",
    paddingHorizontal: theme.spacing[3],
    alignItems: "center",
    height: "100%",
    gap: theme.spacing[2],
  },
  flatlistContainer: {
    flex: 1,
    borderBottomWidth: theme.borderWidths.thin,
    borderColor: theme.colors.background,
  },
  vertical: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  bottomContainer: {
    backgroundColor: theme.colors.slate2,
  },
  icon: {
    color: theme.colors.textDark,
  },
}));

export default PaycycleScreen;
