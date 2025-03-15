import { SelectJobs, job } from "@/db/schema";
import { useDatabase } from "@/hooks/useDatabase";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { toNumber } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";
import { OTCycle, Paycycle, Stringified } from "@/utils/typescript";
import { Alert } from "react-native";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import Icon from "@/components/Icon";

const EditJob = () => {
  const {
    jobId,
    name: jobName,
    description: jobDescription,
    overtimeBoundaryMins,
    overtimePeriod,
    breakDurationMins,
    paycycleDays,
    minShiftDurationMins,
  } = useLocalSearchParams<
    Stringified<SelectJobs> & {
      jobId: string;
    }
  >();
  const { db } = useDatabase();
  const overtimeCycle =
    toNumber(overtimePeriod) === OTCycle.Week ? OTCycle.Week : OTCycle.Day;
  const paycyclePeriod =
    toNumber(paycycleDays) === Paycycle.Weekly
      ? Paycycle.Weekly
      : Paycycle.Biweekly;

  const submitForm = async ({
    name,
    description,
    overtimeCycle,
    overtimeMins,
    overtimeHours,
    breakDuration,
    minShiftDurationMins,
  }: FormFields) => {
    try {
      const overtimeBoundaryMins = overtimeHours * 60 + overtimeMins;
      await db
        .update(job)
        .set({
          name,
          description,
          overtimeBoundaryMins,
          overtimePeriod: overtimeCycle,
          breakDurationMins: breakDuration,
          minShiftDurationMins,
        })
        .where(eq(job.id, toNumber(jobId)));
      router.navigate("/");
    } catch (err: unknown) {
      console.error("Insertion Error:", err);
    }
  };

  const deleteJob = (jobId: number) => {
    Alert.alert(
      "Are you sure?",
      "This will delete this job and all its associated shifts.",
      [
        {
          text: "OK",
          style: "default",
          onPress: async () => {
            await db?.delete(job).where(eq(job.id, jobId));
            router.navigate("/");
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Job",
          headerLeft: (props) => {
            return (
              props.canGoBack && (
                <NativePlatformPressable
                  unstyled
                  borderless
                  onPress={() => router.back()}
                  hitSlop={20}
                >
                  <Icon name="arrow-left" />
                </NativePlatformPressable>
              )
            );
          },
        }}
      />
      <JobForm
        initialValues={{
          name: jobName ?? "",
          description: jobDescription ?? "",
          startDate: Temporal.Now.zonedDateTimeISO(),
          minShiftDurationMins: toNumber(minShiftDurationMins),
          overtimeMins: toNumber(overtimeBoundaryMins) % 60,
          overtimeHours: Math.floor(toNumber(overtimeBoundaryMins) / 60),
          overtimeCycle,
          breakDuration: toNumber(breakDurationMins),
          paycyclePeriod,
        }}
        onSubmit={(formData) => submitForm(formData)}
        disabledFields={["startDate"]}
        extraButton={{
          text: "Delete",
          onPress: () => deleteJob(toNumber(jobId)),
        }}
        submitButtonText="Update"
      />
    </>
  );
};

export default EditJob;
