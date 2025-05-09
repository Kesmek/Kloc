import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Separator from "@/components/Separator";
import { useData } from "@/db/DataContext";
import type { Paycycle } from "@/db/schema";
import { usePaycycleMutation } from "@/hooks/usePaycycleMutation";
import { toNumber } from "@/utils/helpers";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Link, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Suspense, useCallback, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native-unistyles";

const formatDate = (date: Temporal.PlainDate, year?: boolean) =>
  date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: year ? "numeric" : undefined,
  });

const JobScreen = () => {
  const { fetchPaycycles, getJobById } = useData();
  const { createPaycycleMutation } = usePaycycleMutation();

  const { jobId: jid, jobName } = useLocalSearchParams<
    "/[jobId]",
    { jobName: string }
  >();
  const jobId = toNumber(jid);

  const [paycyclesQuery, jobQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["paycycles", jobId],
        queryFn: () => fetchPaycycles(jobId),
      },
      {
        queryKey: ["job", jobId],
        queryFn: () => getJobById(jobId),
      },
    ],
  });

  const paycycles = paycyclesQuery.data;
  const job = jobQuery.data!;

  const [outOfCycleRange, setOutOfCycleRange] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!job) return;

      const latestPaycycle = paycycles[0];
      const today = Temporal.Now.plainDateISO();
      if (!latestPaycycle) {
        setOutOfCycleRange(true);
        return;
      }

      if (Temporal.PlainDate.compare(latestPaycycle.endDate, today) < 0) {
        const daysSince = today
          .since(latestPaycycle.endDate)
          .round("days").days;
        if (daysSince > job.paycycleDays) {
          setOutOfCycleRange(true);
        } else {
          const newStart = Temporal.PlainDate.from(latestPaycycle.endDate).add({
            days: 1,
          });
          createPaycycleMutation.mutate({
            jobId: job.id,
            startDate: newStart.toString(),
            endDate: newStart.add({ days: job.paycycleDays - 1 }).toString(),
          });
        }
      }
    }, [createPaycycleMutation, job, paycycles]),
  );

  return (
    <Suspense fallback={<Loading />}>
      <Stack.Screen
        options={{
          headerTitle: `${jobName} Paycycles`,
        }}
      />
      <FlatList
        data={paycycles}
        renderItem={({ item }) => <PaycycleItem paycycle={item} />}
        ItemSeparatorComponent={() => <Separator />}
        style={styles.flatlist}
      />
      <DatePicker
        open={dateModalOpen}
        title={"Paycycle Start Date"}
        minimumDate={Temporal.PlainDate.from(
          Temporal.Now.plainDateISO(),
        ).subtract({
          months: 1,
        })}
        maximumDate={Temporal.PlainDate.from(Temporal.Now.plainDateISO())}
        date={Temporal.PlainDate.from(Temporal.Now.plainDateISO())}
        onConfirm={(date) => {
          setDateModalOpen(false);
          createPaycycleMutation.mutate({
            jobId: job.id,
            startDate: date.toString(),
            endDate: date.add({ days: job.paycycleDays - 1 }).toString(),
          });
          setOutOfCycleRange(false);
        }}
        onCancel={() => {
          setDateModalOpen(false);
        }}
      />
      {outOfCycleRange && (
        <PaycycleWarning onPress={() => setDateModalOpen(true)} />
      )}
    </Suspense>
  );
};

const PaycycleItem = ({ paycycle }: { paycycle: Paycycle }) => {
  const start = Temporal.PlainDate.from(paycycle.startDate);
  const end = Temporal.PlainDate.from(paycycle.endDate);

  return (
    <Link
      href={{
        pathname: "/[jobId]/[paycycleId]",
        params: { jobId: paycycle.jobId, paycycleId: paycycle.id },
      }}
      asChild
    >
      <Button style={styles.card}>
        <Text
          style={styles.text}
          numberOfLines={1}
        >{`${formatDate(start, start.year !== end.year)}`}</Text>
        <Icon name="arrow-right" size={18} style={styles.arrow} />
        <Text
          style={styles.text}
          numberOfLines={1}
        >{`${formatDate(end, start.year !== end.year)}`}</Text>
      </Button>
    </Link>
  );
};

const PaycycleWarning = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.warningContainer}>
      <Button style={styles.warningContent} onPress={onPress}>
        <View style={styles.warningTitleContainer}>
          <Icon name="alert-circle" style={styles.warningIcon} />
          <Text style={styles.warningTitle}>
            Cannot auto-create next paycycle!
          </Text>
        </View>
        <Text style={styles.warningText}>
          The present day is too far from the most recent paycycle. Press here
          manually create your most recently worked paycycle.
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create((theme, rt) => ({
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
    borderRadius: 0,
  },
  arrow: {
    color: theme.colors.slate9,
  },
  flatlist: {
    borderTopWidth: theme.borderWidths.thin,
    borderColor: theme.colors.background,
    marginBlockEnd: rt.insets.bottom,
  },
  warningContainer: {
    position: "absolute",
    bottom: rt.insets.bottom + theme.spacing[2],
    width: "100%",
    zIndex: 10,
  },
  warningIcon: {
    color: theme.colors.red12,
  },
  warningContent: {
    flexDirection: "column",
    backgroundColor: theme.colors.red4,
    borderColor: theme.colors.red7,
    borderWidth: theme.borderWidths.thin,
    borderRadius: theme.radii.xl,
    marginHorizontal: theme.spacing[5],
    padding: theme.spacing[2],
    gap: theme.spacing[2],
  },
  warningTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[1],
  },
  warningTitle: {
    color: theme.colors.red12,
    fontSize: theme.sizes[4],
    fontWeight: "bold",
  },
  warningText: {
    color: theme.colors.text,
    textAlign: "center",
    paddingHorizontal: theme.spacing[2],
  },
}));

export default JobScreen;
