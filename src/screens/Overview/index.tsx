import { useHeaderHeight } from '@react-navigation/elements';
import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmployerCard, {
  cardStyles,
  CARD_HEIGHT,
} from 'src/Components/EmployerCard';
import { OverviewNavigationProps } from 'src/types/navigation';
import { useFilteredEmployerData } from 'src/utils/hooks';

type OverviewProps = OverviewNavigationProps;

const Overview = ({ navigation }: OverviewProps) => {
  const data = useFilteredEmployerData();
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BorderlessButton onPress={() => navigation.navigate('Test')}>
          <Icon name="add" size={30} />
        </BorderlessButton>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          marginTop: headerHeight,
        },
      ]}
    >
      <Animated.View entering={SlideInDown} style={styles.listContainer}>
        {data.map(overviewData => {
          return (
            <EmployerCard
              {...overviewData}
              key={overviewData.employer}
              navigation={navigation}
            />
          );
        })}
        <View style={styles.addButton}>
          <RectButton
            onPress={() => navigation.navigate('Create Employer')}
            style={[StyleSheet.absoluteFill, styles.center]}
          >
            <Icon name="add" size={50} />
          </RectButton>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButton: {
    ...cardStyles.root,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: CARD_HEIGHT,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Overview;
