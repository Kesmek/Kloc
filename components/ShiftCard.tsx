import { Link } from "expo-router";
import NativePlatformPressable from "./NativePlatformPressable";
import { View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Icon from "./Icon";
import { useMemo } from "react";
import type { ShiftCardProps } from "@/utils/typescript";
import { clampDuration } from "@/utils/helpers";

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
  minShiftDurationMins,
  breakDurationMins,
}: ShiftCardProps) => {
  const { styles } = useStyles(stylesheet);
  const startTime = useMemo(
    () => Temporal.ZonedDateTime.from(shift.startTime),
    [shift.startTime],
  );
  const endTime = useMemo(
    () => (shift.endTime ? Temporal.ZonedDateTime.from(shift.endTime) : null),
    [shift.endTime],
  );
  const duration = useMemo(
    () =>
      durationFormat(
        Temporal.Duration.from(shift.endTime ?? { seconds: 0 }).subtract({
          minutes: breakDurationMins,
        }),
      ),
    [breakDurationMins, durationFormat, shift.endTime],
  );

  return (
    <Link
      href={{
        pathname: `/${shift.jobId}/${shift.paycycleId}/${shift.id}`,
        params: {
          startTime: shift.startTime,
          endTime: shift.endTime,
          notes: shift.notes,
          edited: `${shift.isEdited}`,
          minShiftDurationMins,
          breakDurationMins,
        },
      }}
      asChild
    >
      <NativePlatformPressable unstyled style={styles.listButton}>
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
              <Text style={[styles.secondaryText, styles.edited]}>edited</Text>
            )}
          </View>
          {shift.notes && (
            <Text style={styles.secondaryText} numberOfLines={1}>
              {shift.notes}
            </Text>
          )}
        </View>
        <View style={styles.rightInfo}>
          <View style={[styles.horizontal]}>
            <Icon name="arrow-down-right" style={styles.punchIn} />
            <Text style={[styles.text, styles.punchIn]}>
              {startTime.toLocaleString(undefined, {
                timeStyle: "short",
              })}
            </Text>
          </View>
          {endTime && (
            <View style={[styles.horizontal]}>
              <Icon name="arrow-up-right" style={styles.punchOut} />
              <Text style={[styles.text, styles.punchOut]}>
                {endTime.toLocaleString(undefined, {
                  timeStyle: "short",
                })}
              </Text>
            </View>
          )}
          <View style={[styles.horizontal]}>
            <Icon name="clock" style={styles.duration} />
            <Text style={[styles.text, styles.duration]}>{duration}</Text>
          </View>
        </View>
      </NativePlatformPressable>
    </Link>
  );
};

export const stylesheet = createStyleSheet((theme) => ({
  listButton: {
    height: theme.sizes[20],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.slate2,
    gap: theme.spacing["0.5"],
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.sizes[4],
    fontWeight: "500",
  },
  punchIn: {
    color: theme.colors.green11,
  },
  punchInIcon: {
    color: theme.colors.green11,
  },
  duration: {
    color: theme.colors.iris11,
  },
  punchOut: {
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
    flex: 1,
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
  flex: {
    flex: 1,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
  },
  edited: {},
}));

export default ShiftCard;
