import Icon from "@/components/Icon";
import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";
import NativePlatformPressable from "@/components/NativePlatformPressable";
import { useData } from "@/db/DataContext";
import type { Job } from "@/db/schema";
import { toNumber } from "@/utils/helpers";
import { OTCycle, Paycycle, type Stringified } from "@/utils/typescript";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";

const EditJob = () => {
  const { updateJob, deleteJob } = useData();

  const {
    jobId,
    name: jobName,
    description: jobDescription,
    overtimeThresholdMinutes,
    overtimePeriodDays,
    breakDurationMins,
    paycycleDays,
    minShiftDurationMinutes,
  } = useLocalSearchParams<
    Stringified<Job> & {
      jobId: string;
    }
  >();
  const overtimeCycle =
    toNumber(overtimePeriodDays) === OTCycle.Week ? OTCycle.Week : OTCycle.Day;
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
    minShiftDurationMinutes,
  }: FormFields) => {
    try {
      const overtimeThresholdMinutes = overtimeHours * 60 + overtimeMins;
      await updateJob(toNumber(jobId), {
        name,
        description,
        overtimeThresholdMinutes,
        overtimePeriodDays: overtimeCycle,
        breakDurationMins: breakDuration,
        minShiftDurationMinutes,
      });
      router.navigate("/");
    } catch (err: unknown) {
      console.error("Update Error:", err);
    }
  };

  const deleteCurrentJob = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete this job and all its associated shifts.",
      [
        {
          text: "OK",
          style: "default",
          onPress: async () => {
            await deleteJob(toNumber(jobId));
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
          startDate: Temporal.Now.plainDateISO(),
          minShiftDurationMinutes: toNumber(minShiftDurationMinutes),
          overtimeMins: toNumber(overtimeThresholdMinutes) % 60,
          overtimeHours: Math.floor(toNumber(overtimeThresholdMinutes) / 60),
          overtimeCycle,
          breakDuration: toNumber(breakDurationMins),
          paycyclePeriod,
        }}
        onSubmit={(formData) => submitForm(formData)}
        disabledFields={["startDate"]}
        extraButton={{
          text: "Delete",
          onPress: deleteCurrentJob,
        }}
        submitButtonText="Update"
      />
    </>
  );
};

export default EditJob;
