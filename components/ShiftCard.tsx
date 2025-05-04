import { Link } from "expo-router";
import { View, Text } from "react-native";
import Icon from "./Icon";
import { useMemo } from "react";
import type { ShiftCardProps } from "@/utils/typescript";
import { clampDuration } from "@/utils/helpers";
import { StyleSheet } from "react-native-unistyles";
import useActiveDuration from "@/hooks/useActiveDuration";
import { longFormDuration } from "@/utils/shiftFunctions";
import { RectButton } from "react-native-gesture-handler";

const ShiftCard = ({
  shift,
  durationFormat = (duration) => {
    const finalDuration = clampDuration(
      duration,
      Temporal.Duration.from({ hours: 3 }),
    );
    return `${finalDuration
      .round("seconds")
      .total({ unit: "hours" })
      .toPrecision(3)}H`.concat(
      Temporal.Duration.compare(
        duration,
        Temporal.Duration.from({ hours: 3 }),
      ) < 0
        ? "*"
        : "",
    );
  },
  jobId,
  ongoing,
}: ShiftCardProps) => {
  const startTime = useMemo(
    () => Temporal.Instant.from(shift.startTime),
    [shift.startTime],
  );
  const endTime = useMemo(
    () => (shift.endTime ? Temporal.Instant.from(shift.endTime) : null),
    [shift.endTime],
  );

  const { duration } = useActiveDuration(startTime, endTime, ongoing);

  return (
    <Link
      href={{
        pathname: "/[jobId]/[paycycleId]/[shiftId]",
        params: {
          jobId,
          shiftId: shift.id,
          paycycleId: shift.paycycleId,
        },
      }}
      asChild
    >
      <RectButton style={styles.listButton}>
        <View style={styles.leftInfo}>
          <View style={[styles.horizontal, styles.dateContainer]}>
            <Text style={styles.date}>
              <Text style={[styles.secondaryText, styles.dayOfWeek]}>
                {startTime
                  .toLocaleString(undefined, {
                    weekday: "short",
                  })
                  .concat(" ")}
              </Text>
              {startTime.toLocaleString(undefined, {
                day: "2-digit",
                month: "long",
              })}
            </Text>
            {shift.isEdited && (
              <Text style={[styles.secondaryText]}>edited</Text>
            )}
          </View>
          <Text style={styles.secondaryText} numberOfLines={1}>
            {shift.notes}
          </Text>
        </View>
        <View style={styles.rightInfo}>
          <View style={[styles.horizontal]}>
            <Icon name="arrow-down-right" style={styles.startShift} />
            <Text style={[styles.text, styles.startShift]}>
              {startTime.toLocaleString(undefined, {
                timeStyle: "short",
              })}
            </Text>
          </View>
          {endTime && (
            <View style={[styles.horizontal]}>
              <Icon name="arrow-up-right" style={styles.endShift} />
              <Text style={[styles.text, styles.endShift]}>
                {endTime.toLocaleString(undefined, {
                  timeStyle: "short",
                })}
              </Text>
            </View>
          )}
          <View style={[styles.horizontal]}>
            <Icon name="clock" style={styles.duration} />
            <Text style={[styles.text, styles.duration]}>
              {ongoing
                ? longFormDuration(duration)
                : durationFormat(
                    duration.subtract({ minutes: shift.breakDurationMinutes }),
                  )}
            </Text>
          </View>
        </View>
      </RectButton>
    </Link>
  );
};

export const styles = StyleSheet.create((theme) => ({
  listButton: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[2],
    backgroundColor: theme.colors.slate2,
    gap: theme.spacing[1],
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.sizes[4],
    fontWeight: "500",
  },
  startShift: {
    color: theme.colors.green11,
  },
  duration: {
    color: theme.colors.iris11,
  },
  endShift: {
    color: theme.colors.red11,
  },
  dayOfWeek: {
    fontWeight: "500",
    fontSize: theme.sizes["4.5"],
  },
  date: {
    color: theme.colors.text,
    fontSize: theme.sizes["4.5"],
    fontWeight: "bold",
    gap: theme.spacing[2],
  },
  leftInfo: {
    justifyContent: "center",
  },
  dateContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[1],
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
  break: {
    color: theme.colors.text,
  },
  breakIcon: {
    fontSize: theme.sizes[5],
  },
}));

export default ShiftCard;
