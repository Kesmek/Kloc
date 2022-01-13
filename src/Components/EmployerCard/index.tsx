import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderlessButton, TextInput } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from 'src/redux/hooks';
import { removeEmployer } from 'src/redux/punches';
import { OverviewData } from 'src/types/constants';
import { OverviewNavigationProps } from 'src/types/navigation';
import { colors } from 'src/utils/constants';
import { formatDate } from 'src/utils/functions';

type EmployerCardProps = {
  navigation: OverviewNavigationProps['navigation'];
} & OverviewData;

const EmployerCard = ({
  employer,
  firstDay,
  lastDay,
  navigation,
}: EmployerCardProps) => {
  const dispatch = useAppDispatch();
  const formattedFirstDay = formatDate(firstDay);
  const formattedLastDay = formatDate(lastDay);

  const titleRef = useRef<TextInput>(null);
  const [showDelete, setShowDelete] = useState(false);
  const opacity = useSharedValue(1);

  const handleDelete = () => {
    dispatch(removeEmployer({ employer }));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <>
      <Animated.View
        style={[styles.root, animatedStyle]}
        layout={Layout.springify()}
      >
        <View style={styles.row}>
          <Text ref={titleRef} style={styles.title}>
            {employer}
          </Text>
        </View>
        <Text style={styles.subtext}>{`First Worked: ${
          formattedFirstDay.day
        } ${formattedFirstDay.month.substring(0, 3)}, ${
          formattedFirstDay.year
        }`}</Text>
        <Text style={styles.subtext}>{`Last Worked: ${
          formattedLastDay.day
        } ${formattedLastDay.month.substring(0, 3)}, ${
          formattedLastDay.year
        }`}</Text>
      </Animated.View>
      {showDelete && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.delete}
        >
          <BorderlessButton>
            <Icon name="delete" size={32} color={colors.PRIMARY_RED} />
          </BorderlessButton>
        </Animated.View>
      )}
    </>
  );
};

const CARD_HEIGHT = 100;

const styles = StyleSheet.create({
  root: {
    height: CARD_HEIGHT,
    borderRadius: 10,
    backgroundColor: colors.BLACK,
    borderColor: colors.BORDER,
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 5,
    padding: 0,
    flex: 1,
  },
  subtext: {
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delete: {
    position: 'absolute',
    right: '2%',
    top: '10%',
    zIndex: 1,
  },
});

export { styles as cardStyles, CARD_HEIGHT };

export default EmployerCard;
