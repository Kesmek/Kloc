import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import { job, paycycle } from "@/db/schema";
import { useDatabase } from "@/hooks/useDatabase";
import { sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const Home = () => {
  const { styles } = useStyles(stylesheet);
  const { db } = useDatabase();
  const { data: jobs } = useLiveQuery(
    db
      ?.select({
        id: job.id,
        name: job.name,
        paycycleDays: job.paycycleDays,
        overtimeBoundaryMins: job.overtimeBoundaryMins,
        overtimePeriod: job.overtimePeriod,
        description: job.description,
        breakDurationMins: job.breakDurationMins,
        startDate: paycycle.startDate,
        paycycleId: paycycle.id,
        minShiftDurationMins: job.minShiftDurationMins,
      })
      .from(paycycle)
      .rightJoin(
        job,
        sql`${paycycle.id} = (
        SELECT id FROM ${paycycle}
        WHERE ${paycycle.jobId} = ${job.id}
        ORDER BY ${paycycle.startDate} DESC
        LIMIT 1
      )`,
      ),
  );

  //TODO: If date is later than latest paycycle, create new paycycle and navigate to that one. This allows me to avoid having to check if the paycycle exists when starting a new shift (or planned one) from inside a paycycle that isnt the latest one
  const navigateToJob = (id: number, latestPaycycleId: number) => {};

  const renderJobs = (jp: (typeof jobs)[0]) => {
    const { id: jobId, paycycleId, ...rest } = jp;
    return (
      <Link
        href={{
          pathname: `/${jobId}/${paycycleId}`,
          params: {
            ...rest,
          },
        }}
        asChild
      >
        <NativePlatformPressable
          unstyled
          style={styles.listJob}
          // onPress={navigateToJob}
        >
          <Text style={styles.jobName}>{jp.name}</Text>
        </NativePlatformPressable>
      </Link>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Jobs",
          headerRight: (props) => (
            <Link asChild href={"CreateJob"}>
              <NativePlatformPressable unstyled borderless>
                <Icon name="plus" color={props.tintColor} />
              </NativePlatformPressable>
            </Link>
          ),
        }}
      />
      <FlatList
        data={jobs}
        renderItem={({ item }) => renderJobs(item)}
        style={styles.flatlist}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  jobName: {
    color: theme.colors.text,
    fontSize: theme.sizes[5],
    fontWeight: "bold",
  },
  listJob: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.slate2,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
  },
  loading: {
    color: theme.colors.text,
  },
  flatlist: {
    marginTop: theme.spacing["0.5"],
  },
  separator: {
    height: theme.spacing["0.5"],
  },
}));

export default Home;
