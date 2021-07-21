import { RouteProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  Punches: undefined;
  "Edit Punch": { index: number };
};

type PunchesNavigationProps = StackScreenProps<RootStackParamList, "Punches">;
type EditPunchNavigationProps = StackScreenProps<
  RootStackParamList,
  "Edit Punch"
>;

type EditPunchRouteProps = RouteProp<RootStackParamList, "Edit Punch">;

export type {
  PunchesNavigationProps,
  EditPunchNavigationProps,
  RootStackParamList,
  EditPunchRouteProps,
};
