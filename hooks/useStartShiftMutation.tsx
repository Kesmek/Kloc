import { useData } from "@/db/DataContext";
import type { NewShift } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

// Hook to handle starting a shift
export const useShiftMutation = () => {
  const queryClient = useQueryClient();
  const { createShift, updateShift } = useData();

  return useMutation({
    mutationFn: async (shiftData: NewShift) => {
      // 1. Prepare the full shift data for insertion
      const newShiftRecord: NewShift = {
        // ...spread other initial data like notes, breakDurationMinutes=0, isEdited=false...
        ...shiftData,
        startTime: shiftData.startTime.toString(),
        endTime: shiftData.endTime?.toString(),
      };

      // Call update function if endTime exists (updating active shift)
      if (newShiftRecord.endTime && newShiftRecord.id) {
        const createdShift = await updateShift(
          newShiftRecord.id,
          newShiftRecord,
        );
        if (!createdShift) {
          throw new Error("Shift record could not be updated in the database.");
        }
        return createdShift;
      }

      // 3. Call the actual database creation function (which uses Drizzle)
      // This function should return the newly created shift object
      const createdShift = await createShift(newShiftRecord); // Ensure createShift returns the new shift

      if (!createdShift) {
        throw new Error("Shift record could not be created in the database.");
      }

      // Pass necessary info for invalidation if not returned
      return createdShift;
    },
    onSuccess: (data) => {
      // 'data' is the value returned from mutationFn (the created shift + jobId)
      console.log(
        "Shift started/updated successfully, invalidating relevant queries...",
      );

      // --- Invalidate Queries ---
      queryClient.invalidateQueries({ queryKey: ["shifts", data.paycycleId] });
    },
    onError: (error) => {
      console.error("Failed to start/update shift:", error);
      // Provide feedback to the user
      Alert.alert("Error", `Failed to start/update shift: ${error.message}`);
    },
  });
};
