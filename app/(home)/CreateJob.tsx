import { Stack, router } from "expo-router";
import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";
import { useData } from "@/db/DataContext";

const CreateJob = () => {
  const { createJob, createPaycycle } = useData();

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
    try {
      const overtimeBoundaryMins = overtimeHours * 60 + overtimeMins;
      const createdJob = await createJob({
        name,
        overtimeThresholdMinutes: overtimeBoundaryMins,
        overtimePeriodDays: overtimeCycle,
        breakDurationMins: breakDuration,
        paycycleDays: paycyclePeriod,
        description,
        minShiftDurationMinutes,
      });
      if (!createdJob) {
        console.error("Job failed to create!");
        return router.back();
      }
      await createPaycycle({
        jobId: createdJob.id,
        startDate: startDate.toString(),
        endDate: startDate.add({ days: createdJob.paycycleDays }).toString(),
      });

      router.back();
    } catch (err: unknown) {
      console.error("Insertion Error:", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Job",
        }}
      />
      <JobForm onSubmit={(formData) => submitForm(formData)} />
    </>
  );
};

export default CreateJob;
