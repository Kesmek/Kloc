import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Separator from "@/components/Separator";
import { useData } from "@/db/DataContext";
import type { Job, Paycycle } from "@/db/schema";
import { toNumber } from "@/utils/helpers";
import type { Stringified } from "@/utils/typescript";
import { useQuery } from "@tanstack/react-query";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";

const formatDate = (date: Temporal.PlainDate, year?: boolean) =>
  date.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: year ? "numeric" : undefined,
  });

const JobScreen = () => {
  const { fetchPaycycles } = useData();

  const {
    jobId: jid,
    paycycleDays,
    breakDurationMins,
    overtimePeriodDays,
    overtimeThresholdMinutes,
    name,
    description,
    minShiftDurationMinutes,
  } = useLocalSearchParams<"/[jobId]", Stringified<Job>>();
  const jobId = toNumber(jid);

  const { data: paycycles, isLoading } = useQuery({
    queryKey: ["paycycle"],
    queryFn: () => fetchPaycycles(jobId),
  });

  const renderPaycycles = (paycycle: Paycycle) => {
    const start = Temporal.PlainDate.from(paycycle.startDate);
    const end = start.add({ days: toNumber(paycycleDays) - 1 });
    console.log(start, end);

    return (
      <Link
        href={{
          pathname: "/[jobId]/[paycycleId]",
          params: {
            jobId,
            paycycleId: paycycle.id,
            startDate: paycycle.startDate,
            endDate: paycycle.endDate,
            paycycleDays,
            breakDurationMins,
            description,
            name,
            overtimePeriodDays,
            overtimeThresholdMinutes,
            minShiftDurationMinutes,
          } satisfies Stringified<Omit<Job, "id">> & {
            jobId: number;
            paycycleId: number;
            startDate: string;
            endDate: string;
          },
        }}
        asChild
      >
        <NativePlatformPressable unstyled style={styles.card}>
          <Text
            style={styles.text}
            numberOfLines={1}
          >{`${formatDate(start, start.year !== end.year)}`}</Text>
          <Icon name="arrow-right" size={18} style={styles.arrow} />
          <Text
            style={styles.text}
            numberOfLines={1}
          >{`${formatDate(end, start.year !== end.year)}`}</Text>
        </NativePlatformPressable>
      </Link>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${name} Paycycles`,
        }}
      />
      <FlatList
        data={paycycles}
        renderItem={({ item }) => renderPaycycles(item)}
        ItemSeparatorComponent={() => <Separator />}
        style={styles.flatlist}
      />
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  text: {
    color: theme.colors.text,
    fontSize: theme.sizes[4],
    textAlign: "left",
    flex: 1,
  },
  card: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.slate2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing[4],
  },
  arrow: {
    color: theme.colors.accent,
  },
  flatlist: {
    borderTopWidth: theme.borderWidths.thin,
    borderColor: theme.colors.background,
  },
}));

export default JobScreen;
