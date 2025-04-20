import Icon from "@/components/Icon";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import { useData } from "@/db/DataContext";
import type { Job } from "@/db/schema";
import { Link, Stack, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Home = () => {
  const { findLastShiftContext, fetchJobs } = useData();
  const router = useRouter();

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs(), // Fetch function using Drizzle
  });

  useEffect(() => {
    const determineInitialRoute = async () => {
      const params = await findLastShiftContext();
      console.log(params);

      if (params) {
        router.navigate({
          pathname: "/[jobId]/[paycycleId]",
          params: { jobId: params.jobId, paycycleId: params.paycycleId },
        });
      }
    };

    determineInitialRoute();
  }, [router, findLastShiftContext]);

  //TODO: If date is later than latest paycycle, create new paycycle and navigate to that one. This allows me to avoid having to check if the paycycle exists when starting a new shift (or planned one) from inside a paycycle that isnt the latest one
  const renderJobs = (job: Job) => {
    return (
      <Link
        href={{
          pathname: "/[jobId]",
          params: {
            jobId: job.id,
            ...job,
          },
        }}
        asChild
      >
        <NativePlatformPressable
          unstyled
          style={styles.listJob}
          // onPress={navigateToJob}
        >
          <Text style={styles.jobName}>{job.name}</Text>
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
            <Link asChild href={"/CreateJob"}>
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
        ListEmptyComponent={<Text>Loading...</Text>}
      />
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
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
