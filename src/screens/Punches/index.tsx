import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFilteredYearData } from 'src/utils/hooks';

type PunchListType = {
  employer: string;
  year?: number;
};

const Punches = ({ employer }: PunchListType) => {
  const punchData = useFilteredYearData(employer, new Date().getFullYear());

  useEffect(() => {
    console.log(punchData);
  }, [punchData]);

  return (
    <View style={styles.root}>
      <Text>{new Date().getTime()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'salmon',
  },
});

export default Punches;
