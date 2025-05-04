import { useData } from "@/db/DataContext";
import type { Job, NewJob } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useJobMutation = () => {
  const queryClient = useQueryClient();
  const { createJob, updateJob, deleteJob, createPaycycle } = useData();

  const createJobMutation = useMutation({
    mutationFn: async ({
      jobData,
      startDate,
    }: { jobData: NewJob; startDate: Temporal.PlainDate }) => {
      // 1. Prepare the full job data for insertion
      const newJob: NewJob = {
        ...jobData,
      };

      // 2. Call the actual database creation function
      const createdJob = await createJob(newJob);

      if (!createdJob) {
        throw new Error("Job record could not be created in the database.");
      }

      // 3. Automatically create the first paycycly for convenience
      const createdPaycycle = await createPaycycle({
        jobId: createdJob.id,
        startDate: startDate.toString(),
        endDate: startDate
          .add({ days: createdJob.paycycleDays - 1 })
          .toString(),
      });

      if (!createdPaycycle) {
        throw new Error(
          "Paycycyle record could not be created in the database.",
        );
      }

      // Pass necessary info for invalidation if not returned
      return createdJob;
    },
    onSuccess: () => {
      console.log("Job created successfully, invalidating relevant queries...");

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Failed to create job or paycycle:", error);
      // Provide feedback to the user
      Alert.alert(
        "Error",
        `Failed to create job or paycycle: ${error.message}`,
      );
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async (jobData: Job) => {
      const createdJob = await updateJob(jobData.id, jobData);

      if (!createdJob) {
        throw new Error("Job record could not be created in the database.");
      }

      // Pass necessary info for invalidation if not returned
      return createdJob;
    },
    onSuccess: (job) => {
      console.log("Job updated successfully, invalidating relevant queries...");
      queryClient.setQueryData(["job", job.id], job);

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Failed to update job:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to update job: ${error.message}`);
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const deletedJob = await deleteJob(jobId);

      if (!deletedJob) {
        throw new Error("Job record could not be deleted in the database.");
      }

      return deletedJob;
    },
    onSuccess: () => {
      console.log("Job deleted successfully, invalidating relevant queries...");

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      console.error("Failed to delete job:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to delete job: ${error.message}`);
    },
  });

  return { deleteJobMutation, updateJobMutation, createJobMutation };
};
