import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";
import Loading from "@/components/Loading";
import { useData } from "@/db/DataContext";
import { useJobMutation } from "@/hooks/useJobMutation";
import { toNumber } from "@/utils/helpers";
import { OTCycle, Paycycle } from "@/utils/typescript";
import { useSuspenseQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Suspense } from "react";
import { Alert } from "react-native";

const EditJob = () => {
  const { getJobById } = useData();
  const { updateJobMutation, deleteJobMutation } = useJobMutation();

  const { jobId: jid } = useLocalSearchParams<"/[jobId]">();
  const jobId = toNumber(jid);

  const { data: jobQuery } = useSuspenseQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
  });

  const job = jobQuery!;

  const overtimeCycle =
    job.overtimePeriodDays === OTCycle.Week ? OTCycle.Week : OTCycle.Day;
  const paycyclePeriod =
    job.paycycleDays === Paycycle.Weekly ? Paycycle.Weekly : Paycycle.Biweekly;

  const submitForm = async ({
    name,
    description,
    overtimeCycle,
    overtimeMins,
    overtimeHours,
    breakDuration,
    minShiftDurationMinutes,
  }: FormFields) => {
    const overtimeThresholdMinutes = overtimeHours * 60 + overtimeMins;
    updateJobMutation.mutate({
      id: jobId,
      name,
      description,
      overtimeThresholdMinutes,
      overtimePeriodDays: overtimeCycle,
      breakDurationMinutes: breakDuration,
      minShiftDurationMinutes,
      paycycleDays: job.paycycleDays,
      timezone: job.timezone,
    });
    router.dismissTo("/");
  };

  const deleteCurrentJob = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete this job and all its associated shifts.",
      [
        {
          text: "OK",
          style: "default",
          onPress: () => {
            deleteJobMutation.mutate(jobId);
            router.dismissTo("/");
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
    <Suspense fallback={<Loading />}>
      <JobForm
        initialValues={{
          name: job.name,
          description: job.description ?? "",
          startDate: Temporal.Now.plainDateISO(),
          minShiftDurationMinutes: job.minShiftDurationMinutes,
          overtimeMins: job.overtimeThresholdMinutes % 60,
          overtimeHours: Math.floor(job.overtimeThresholdMinutes / 60),
          overtimeCycle,
          breakDuration: job.breakDurationMinutes,
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
    </Suspense>
  );
};

export default EditJob;
