import Icon from "@/components/Icon";
import { useData } from "@/db/DataContext";
import type { Job } from "@/db/schema";
import { type ErrorBoundaryProps, Link, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { BorderlessButton, FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";
import {
  useQueryClient,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

// Wraps the component in an expo router error boundary
export const ErrorBoundary = ({ error, retry }: ErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text
        onPress={() => {
          reset();
          retry();
        }}
      >
        Try Again?
      </Text>
    </View>
  );
};

const Home = () => {
  const { findLastShiftContext, fetchJobs, fetchPaycycles } = useData();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { data: jobs } = useSuspenseQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const jobs = await fetchJobs();

      for (const job of jobs) {
        queryClient.prefetchQuery({
          queryKey: ["paycycle", job.id],
          queryFn: () => fetchPaycycles(job.id),
        });
      }

      return jobs;
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run on initial app load
  useEffect(() => {
    const determineInitialRoute = async () => {
      const params = await findLastShiftContext();

      if (params) {
        router.navigate({
          pathname: "/[jobId]/[paycycleId]",
          params: { jobId: params.jobId, paycycleId: params.paycycleId },
        });
      }
    };

    determineInitialRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderJobs = (job: Job) => {
    return (
      <Link
        href={{
          pathname: "/[jobId]",
          params: {
            jobId: job.id,
            jobName: job.name,
          },
        }}
        asChild
      >
        <Button style={styles.listJob}>
          <View>
            <Text style={styles.jobName}>{job.name}</Text>
            {job.description && (
              <Text style={styles.description}>{job.description}</Text>
            )}
          </View>
          <Link
            href={{
              pathname: "/[jobId]/edit",
              params: {
                jobId: job.id,
              },
            }}
            asChild
          >
            <BorderlessButton rippleRadius={25} hitSlop={25}>
              <Icon name="edit" color={"white"} />
            </BorderlessButton>
          </Link>
        </Button>
      </Link>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.createJobContainer}>
      <Text style={[styles.jobName, styles.noJobText]}>No jobs yet</Text>
    </View>
  );

  return (
    <Suspense fallback={<Loading />}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => renderJobs(item)}
        style={styles.flatlist}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          <View style={styles.createJobContainer}>
            <Link href={"/CreateJob"} asChild>
              <Button style={styles.newJobButton}>
                <Icon name="plus" />
                <Text style={styles.jobName}>Create New Job</Text>
              </Button>
            </Link>
          </View>
        }
      />
    </Suspense>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
  jobName: {
    color: theme.colors.text,
    fontSize: theme.sizes[5],
    fontWeight: "bold",
  },
  listJob: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.slate2,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[6],
    borderRadius: 0,
  },
  loading: {
    color: theme.colors.text,
  },
  flatlist: {
    marginTop: theme.spacing["0.5"],
    marginBottom: rt.insets.bottom,
  },
  separator: {
    height: theme.spacing["0.5"],
  },
  description: {
    color: theme.colors.textSecondary,
  },
  createJobContainer: {
    marginBlockStart: theme.spacing[5],
    gap: theme.spacing[3],
    alignItems: "center",
  },
  noJobText: {
    color: theme.colors.slate11,
    fontWeight: "medium",
  },
  createJob: {
    flexDirection: "row",
    alignItems: "center",
  },
  newJobButton: {
    gap: theme.spacing[1],
  },
}));

export default Home;
