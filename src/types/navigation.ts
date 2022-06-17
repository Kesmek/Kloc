import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackNavigator = {
  "Employer Picker": undefined
  "Edit Employer": { id?: string; };
  Shifts: { name: string, year: number };
  "Edit Shift": { id: string };
}

export type EmployerPickerNavigationProps = NativeStackScreenProps<RootStackNavigator, "Employer Picker">;
export type EditEmployerNavigationProps = NativeStackScreenProps<RootStackNavigator, "Edit Employer">;
export type ShiftsNavigationProps = NativeStackScreenProps<RootStackNavigator, "Shifts">;
export type EditShiftNavigationProps = NativeStackScreenProps<RootStackNavigator, "Edit Shift">;
