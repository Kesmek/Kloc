import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Overview: undefined;
  Punches: { name: string };
  'Create Employer': undefined;
  Test: undefined;
};

type OverviewNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Overview'
>;

type CreateEmployerNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Create Employer'
>;

export type {
  RootStackParamList,
  OverviewNavigationProps,
  CreateEmployerNavigationProps,
};
