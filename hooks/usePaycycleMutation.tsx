import { useData } from "@/db/DataContext";
import type { NewPaycycle } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const usePaycycleMutation = () => {
  const queryClient = useQueryClient();
  const { createPaycycle, deletePaycycle } = useData();

  const createPaycycleMutation = useMutation({
    mutationFn: async (paycycleData: NewPaycycle) => {
      // 1. Prepare the full paycycle data for insertion
      const newPaycycle: NewPaycycle = {
        ...paycycleData,
      };

      // 2. Call the actual database creation function
      const createdPaycycle = await createPaycycle(newPaycycle);

      if (!createdPaycycle) {
        throw new Error(
          "Paycycle record could not be created in the database.",
        );
      }

      // Pass necessary info for invalidation if not returned
      return createdPaycycle;
    },
    onSuccess: (data) => {
      console.log(
        "Paycycle created successfully, invalidating relevant queries...",
      );

      queryClient.invalidateQueries({ queryKey: ["paycycles", data.jobId] });
    },
    onError: (error) => {
      console.error("Failed to create paycycle:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to create paycycle: ${error.message}`);
    },
  });

  const deletePaycycleMutation = useMutation({
    mutationFn: async (paycycleId: number) => {
      const deletedPaycycle = await deletePaycycle(paycycleId);

      if (!deletedPaycycle) {
        throw new Error(
          "Paycycle record could not be deleted in the database.",
        );
      }

      return deletedPaycycle;
    },
    onSuccess: (data) => {
      console.log(
        "Paycycle deleted successfully, invalidating relevant queries...",
      );

      queryClient.invalidateQueries({ queryKey: ["paycycles", data.jobId] });
    },
    onError: (error) => {
      console.error("Failed to delete paycycle:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to delete paycycle: ${error.message}`);
    },
  });

  return { deletePaycycleMutation, createPaycycleMutation };
};
