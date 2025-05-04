import { router } from "expo-router";
import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";
import { useJobMutation } from "@/hooks/useJobMutation";

const CreateJob = () => {
  const { createJobMutation } = useJobMutation();

  const submitForm = async ({
    overtimeHours,
    overtimeMins,
    overtimeCycle,
    description,
    startDate,
    name,
    breakDuration,
    paycyclePeriod,
    minShiftDurationMinutes,
  }: FormFields) => {
    const overtimeBoundaryMins = overtimeHours * 60 + overtimeMins;
    const timezone = Temporal.Now.timeZoneId();
    createJobMutation.mutate({
      jobData: {
        name,
        overtimeThresholdMinutes: overtimeBoundaryMins,
        overtimePeriodDays: overtimeCycle,
        breakDurationMinutes: breakDuration,
        paycycleDays: paycyclePeriod,
        description,
        minShiftDurationMinutes,
        timezone,
      },
      startDate,
    });
    router.dismissTo("/");
  };

  return (
    <>
      <JobForm onSubmit={(formData) => submitForm(formData)} />
    </>
  );
};

export default CreateJob;
