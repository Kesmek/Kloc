import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Separator from "@/components/Separator";
import { db } from "@/db/drizzle";
import { SelectJobs, SelectPaycycle, paycycle } from "@/db/schema";
import { toNumber } from "@/utils/helpers";
import { Stringified } from "@/utils/typescript";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const formatDate = (date: Temporal.ZonedDateTime, year?: boolean) =>
  date.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: year ? "numeric" : undefined,
  });

const Job = () => {
  const {
    jobId: jid,
    paycycleDays,
    breakDurationMins: breakDuration,
    overtimePeriod: otPeriod,
    overtimeBoundaryMins: otBoundary,
    name,
    description,
  } = useLocalSearchParams<
    Stringified<SelectJobs> & {
      jobId: string;
    }
  >();
  const jobId = toNumber(jid);
  const { data: paycycles } = useLiveQuery(
    db.select().from(paycycle).where(eq(paycycle.jobId, jobId)),
  );

  const { styles } = useStyles(stylesheet);

  const renderPaycycles = (paycycle: SelectPaycycle) => {
    const start = Temporal.ZonedDateTime.from(paycycle.startDate);
    const end = start.add({ days: toNumber(paycycleDays) - 1 });
    return (
      <Link
        href={{
          pathname: `/${jobId}/${paycycle.id}/`,
          params: {
            startDate: paycycle.startDate,
            paycycleDays,
            breakDurationMins: breakDuration,
            description,
            name,
            overtimePeriod: otPeriod,
            overtimeBoundaryMins: otBoundary,
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

const stylesheet = createStyleSheet((theme) => ({
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

export default Job;
