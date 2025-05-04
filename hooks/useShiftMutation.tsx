import { useData } from "@/db/DataContext";
import type { NewShift, Shift } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

// Hook to handle starting a shift
export const useShiftMutation = () => {
  const queryClient = useQueryClient();
  const { createShift, updateShift, deleteShift } = useData();

  const createShiftMutation = useMutation({
    mutationFn: async (shiftData: NewShift) => {
      // 1. Prepare the full shift data for insertion
      const newShift: NewShift = {
        ...shiftData,
      };

      // 2. Call the actual database creation function
      const createdShift = await createShift(newShift);

      if (!createdShift) {
        throw new Error("Shift record could not be created in the database.");
      }

      // Pass necessary info for invalidation if not returned
      return createdShift;
    },
    onSuccess: (data) => {
      console.log(
        "Shift created successfully, invalidating relevant queries...",
      );

      queryClient.invalidateQueries({ queryKey: ["shifts", data.paycycleId] });
    },
    onError: (error) => {
      console.error("Failed to create shift:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to create shift: ${error.message}`);
    },
  });

  const updateShiftMutation = useMutation({
    mutationFn: async (shiftData: Shift) => {
      const updatedShift = await updateShift(shiftData.id, shiftData);

      if (!updatedShift) {
        throw new Error("Shift record could not be created in the database.");
      }

      return updatedShift;
    },
    onSuccess: (data) => {
      console.log(
        "Shift updated successfully, invalidating relevant queries...",
      );

      queryClient.invalidateQueries({ queryKey: ["shifts", data.paycycleId] });
    },
    onError: (error) => {
      console.error("Failed to update shift:", error);
      Alert.alert("Error", `Failed to update shift: ${error.message}`);
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: async (shiftId: number) => {
      const deletedShift = await deleteShift(shiftId);

      if (!deletedShift) {
        throw new Error("Shift record could not be deleted in the database.");
      }

      return deletedShift;
    },
    onSuccess: (data) => {
      console.log(
        "Shift deleted successfully, invalidating relevant queries...",
      );

      queryClient.invalidateQueries({ queryKey: ["shifts", data.paycycleId] });
    },
    onError: (error) => {
      console.error("Failed to delete shift:", error);
      Alert.alert("Error", `Failed to delete shift: ${error.message}`);
    },
  });

  return { createShiftMutation, updateShiftMutation, deleteShiftMutation };
};
