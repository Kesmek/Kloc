import { RouteProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  Punches: undefined;
  "Edit Punch": { index: number; month: number; year: number };
  "Manual Punch": undefined;
};

type PunchesNavigationProps = StackScreenProps<RootStackParamList, "Punches">;
type EditPunchNavigationProps = StackScreenProps<
  RootStackParamList,
  "Edit Punch"
>;
type CustomPunchNavigationProps = StackScreenProps<
  RootStackParamList,
  "Manual Punch"
>;

type EditPunchRouteProps = RouteProp<RootStackParamList, "Edit Punch">;

export type {
  PunchesNavigationProps,
  EditPunchNavigationProps,
  RootStackParamList,
  EditPunchRouteProps,
  CustomPunchNavigationProps,
};
