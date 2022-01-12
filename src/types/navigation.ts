import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Overview: undefined;
  Punches: { name: string };
};

type OverviewNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'Overview'
>;

export type { RootStackParamList, OverviewNavigationProps };
