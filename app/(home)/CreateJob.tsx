import { job, paycycle } from "@/db/schema";
import { useDatabase } from "@/hooks/useDatabase";
import { Stack, router } from "expo-router";
import type { FormFields } from "@/components/JobForm";
import JobForm from "@/components/JobForm";

const CreateJob = () => {
  const { db } = useDatabase();

  const submitForm = async ({
    overtimeHours,
    overtimeMins,
    overtimeCycle,
    description,
    startDate,
    name,
    breakDuration,
    paycyclePeriod,
    minShiftDurationMins,
  }: FormFields) => {
    try {
      const overtimeBoundaryMins = overtimeHours * 60 + overtimeMins;
      const [returnedJob] = await db
        ?.insert(job)
        .values({
          name,
          overtimeBoundaryMins: overtimeBoundaryMins,
          overtimePeriod: overtimeCycle,
          breakDurationMins: breakDuration,
          paycycleDays: paycyclePeriod,
          description,
          minShiftDurationMins,
        })
        .returning({ id: job.id });
      await db?.insert(paycycle).values({
        jobId: returnedJob.id,
        startDate: startDate.startOfDay().toString(),
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
