import { RouteProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

type RootStackParamList = {
  Punches: undefined;
  "Edit Punch": { index: number; month: number };
  "Manual Punch": undefined;
  "Year Selector": undefined;
  Calculator: undefined;
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
type YearSelectorNavigationProps = StackScreenProps<
  RootStackParamList,
  "Year Selector"
>;
type CalculatorNavigationProps = StackScreenProps<
  RootStackParamList,
  "Calculator"
>;

type EditPunchRouteProps = RouteProp<RootStackParamList, "Edit Punch">;

export type {
  CalculatorNavigationProps,
  CustomPunchNavigationProps,
  EditPunchNavigationProps,
  EditPunchRouteProps,
  PunchesNavigationProps,
  RootStackParamList,
  YearSelectorNavigationProps,
};
