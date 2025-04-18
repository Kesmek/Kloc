import ActiveShift from "@/components/ActiveShift";
import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Separator from "@/components/Separator";
import Shift from "@/components/ShiftCard";
import { db } from "@/db/drizzle";
import {
  type SelectJobs,
  type SelectPaycycle,
  paycycle,
  shift,
} from "@/db/schema";
import { toNumber } from "@/utils/helpers";
import {
  filterCompleteShift,
  filterOngoingShift,
  getNextStartDate,
  getPaycycleStats,
  getPrevStartDate,
  isAfterPaycycle,
  isBeforePaycycle,
  isOutsidePaycycle,
} from "@/utils/shiftFunctions";
import type { Stringified } from "@/utils/typescript";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { desc } from "drizzle-orm";
import DatePicker from "@/components/DatePicker";

const Paycycle = () => {
  const {
    jobId: jid,
    paycycleId: pcid,
    startDate,
    paycycleDays,
    breakDurationMins: breakDuration,
    overtimePeriodDays: otPeriod,
    overtimeThresholdMinutes: otBoundary,
    name,
    description,
    minShiftDurationMinutes: minShiftDuration,
  } = useLocalSearchParams<
    Stringified<SelectJobs> & {
      jobId: string;
      paycycleId: string;
      startDate: string;
    }
  >();

  const jobId = toNumber(jid);
  const paycycleId = toNumber(pcid);
  const paycycleStartDate = Temporal.PlainDate.from(startDate);
  const paycycleDurationDays = toNumber(paycycleDays);
  const today = Temporal.Now.plainDateTimeISO();
  const breakDurationMins = toNumber(breakDuration);
  const overtimePeriod = toNumber(otPeriod);
  const overtimeBoundaryMins = toNumber(otBoundary);
  const minShiftDurationMins = toNumber(minShiftDuration);

  const { data: shiftsQuery } = useLiveQuery(
    db
      .select()
      .from(shift)
      .where(eq(shift.paycycleId, paycycleId))
      .orderBy(desc(shift.startTime)),
  );

  const { styles, theme } = useStyles(stylesheet);

  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [ongoingShift, setOngoingShift] = useState(
    shiftsQuery.find(filterOngoingShift),
  );

  const renderHeader = () => {
    const cycleStart = paycycleStartDate;
    // Subtract one because the first day is included in the paycycle duration
    const periodEnd = cycleStart.add({ days: paycycleDurationDays - 1 });
    const shifts = shiftsQuery.filter(filterCompleteShift);

    const {
      totalRegularHours,
      totalovertimeHours,
      totalWeekOneHours,
      totalWeekTwoHours,
    } = getPaycycleStats(
      shifts,
      overtimePeriod,
      overtimeBoundaryMins,
      breakDurationMins,
      paycycleStartDate,
    );

    return (
      <View style={styles.header}>
        <View style={styles.vertical}>
          <Link
            href={{
              pathname: `/${jobId}`,
              params: {
                name,
                description,
                overtimeBoundaryMins,
                overtimePeriod,
                breakDurationMins,
                paycycleDays,
                paycycleId,
              },
            }}
            asChild
          >
            <NativePlatformPressable style={styles.headerButton} unstyled>
              <Icon name="calendar" style={styles.headerSecondaryText} />
              <Text style={styles.headerSecondaryText}>
                {`${cycleStart.toLocaleString(undefined, { month: "short", day: "numeric" })} - ${periodEnd.toLocaleString(undefined, { month: "short", day: "numeric" })}`}
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
    const now = Temporal.Now.plainDateTimeISO();
    await handlePressScheduled(now, false);
  };

  const handlePressScheduled = async (
    dateTime: Temporal.PlainDateTime,
    isEdited = true,
  ) => {
    if (ongoingShift) {
      await db
        ?.update(shift)
        .set({
          endTime: dateTime.toString(),
          isEdited,
        })
        .where(eq(shift.id, ongoingShift.id));
      setOngoingShift(undefined);
    } else {
      const shiftOutsidePeriod = isOutsidePaycycle(
        paycycleStartDate,
        paycycleDurationDays,
        dateTime,
      );
      let newCycle: SelectPaycycle = {
        id: paycycleId,
        jobId,
        startDate: paycycleStartDate.toString(),
      };

      // After pay cycle
      if (shiftOutsidePeriod > 0) {
        let nextCycleStart = paycycleStartDate;

        do {
          nextCycleStart = getNextStartDate(
            paycycleStartDate,
            paycycleDurationDays,
          );

          [newCycle] = await db
            ?.insert(paycycle)
            .values({
              jobId,
              startDate: nextCycleStart.toString(),
            })
            .returning();
        } while (
          // Need to add paycycle duration to start date
          isAfterPaycycle(
            nextCycleStart.add({ days: paycycleDurationDays }),
            dateTime,
          )
        );
      } else if (shiftOutsidePeriod < 0) {
        // Before pay cycle
        let prevCycleStart = paycycleStartDate;

        do {
          prevCycleStart = getPrevStartDate(
            paycycleStartDate,
            paycycleDurationDays,
          );
          // Grab first index since it's guaranteed to only return one element anyway
          [newCycle] = await db
            ?.insert(paycycle)
            .values({
              jobId,
              startDate: prevCycleStart.toString(),
            })
            .onConflictDoNothing()
            .returning();
        } while (isBeforePaycycle(prevCycleStart, dateTime));
      }

      await db?.insert(shift).values({
        startTime: dateTime.toString(),
        endTime: dateTime.add({ days: paycycleDurationDays }),
        jobId,
        paycycleId: newCycle.id,
        isEdited,
      });
      if (newCycle.id !== paycycleId) {
        router.replace({
          pathname: `${jobId}/${newCycle.id}/`,
          params: {
            startDate,
            paycycleDays,
            breakDurationMins,
            overtimePeriod,
            overtimeBoundaryMins,
            name,
            description,
            minShiftDurationMins,
          },
        });
      }
    }
  };

  useEffect(() => {
    setOngoingShift(shiftsQuery.find(filterOngoingShift));
  }, [shiftsQuery]);

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerRight: (props) => (
            <Link
              href={{
                pathname: `/${jobId}/edit`,
                params: {
                  name,
                  description,
                  overtimeBoundaryMins,
                  overtimePeriod,
                  breakDurationMins,
                  paycycleDays,
                  minShiftDurationMins,
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
              minShiftDurationMins={minShiftDurationMins}
              breakDurationMins={breakDurationMins}
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
        minimumDate={Temporal.PlainDateTime.from(paycycleStartDate)}
        maximumDate={today}
        mode="datetime"
        date={Temporal.Now.plainDateTimeISO()}
        onConfirm={(date) => {
          handlePressScheduled(date);
          setDateModalOpen(false);
        }}
        onCancel={() => {
          setDateModalOpen(false);
        }}
      />
      <View style={styles.bottomContainer}>
        {ongoingShift && (
          <ActiveShift
            shift={ongoingShift}
            minShiftDurationMins={minShiftDurationMins}
            breakDurationMins={breakDurationMins}
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
            <Icon name="clock" color={theme.colors.textDark} />
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
            <Icon name="clock" color={theme.colors.textDark} />
            <Text style={styles.buttonText}>
              {ongoingShift ? "End" : "Start"}
            </Text>
          </NativePlatformPressable>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet((theme) => ({
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
}));

export default Paycycle;
