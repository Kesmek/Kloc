import { Text, View } from 'react-native';
import { OverviewData } from 'src/types/constants';

type EmployerCardProps = OverviewData;

const EmployerCard = ({ employer, firstDay, lastDay }: EmployerCardProps) => {
  return (
    <View>
      <Text>{employer}</Text>
      <Text>{firstDay}</Text>
      <Text>{lastDay}</Text>
    </View>
  );
};

export default EmployerCard;
