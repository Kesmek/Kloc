import { useEffect, useLayoutEffect, useState } from "react";
import {
  Text,
  View,
  Alert,
  SectionList,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import {
  BaseButton,
  BorderlessButton,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  RectButton,
} from "react-native-gesture-handler";
import Animated, {
  AnimatedLayout,
  FadeInUp,
  FadeOutUp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  addDate,
  createSelectPunches,
  PunchRecord,
  punchIn,
  punchOut,
  createSelectSectionedPunches,
} from "../../redux/punches";
import { PunchesNavigationProps } from "../../types/navigation";
import { colors } from "../../utils/constants";
import { calculateHours, formatDate } from "../../utils/functions";
import styles from "./styles";

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);

const Punches = ({ navigation }: PunchesNavigationProps) => {
  const data = useAppSelector(createSelectPunches());
  const sectionedData = useAppSelector(createSelectSectionedPunches());
  const dispatch = useAppDispatch();

  const [showMore, setShowMore] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number; offsetY: number }
  >({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const animatedButton = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value / 2 },
        { translateY: translateY.value / 2 },
      ],
    };
  });

  const createDay = () => {
    const today = new Date();
    const matches = data.filter((date) => {
      const day = new Date(date.date);
      return day.getDate() === today.getDate();
    });

    if (!matches.length) {
      dispatch(addDate());
    } else {
      Alert.alert(
        "Work day already exists for today",
        "You've already added a work day for today, try again on another day.",
        [
          {
            text: "ok",
          },
        ],
      );
    }
  };

  const handlePunchOut = (inDate: Date, outDate: Date, index: number) => {
    if (inDate.getTime() === 0) {
      Alert.alert(
        "Punch-In Missing",
        "You must punch in before you can punch out.",
        [
          {
            text: "ok",
          },
        ],
      );
    } else if (outDate.getTime() === 0) {
      dispatch(punchOut(index));
    }
  };

  const handleCalculateHours = () => {
    setShowMore(false);
  };

  const renderSectionHeader = ({
    section: { month, data },
  }: {
    section: SectionListData<PunchRecord>;
  }) => {
    // if (data.length) {
    return (
      <Text
        style={{
          backgroundColor: colors.BACKGROUND,
          color: colors.PRIMARY_WHITE,
          fontSize: 24,
          fontWeight: "bold",
          paddingLeft: 15,
        }}
      >
        {month}
      </Text>
    );
    // } else {
    //   return null;
    // }
  };

  const renderItem: SectionListRenderItem<PunchRecord> = ({ item, index }) => {
    const rawDate = new Date(item.date);
    const rawPunchIn = new Date(item.punchIn ?? 0);
    const rawPunchOut = new Date(item.punchOut ?? 0);
    const date = formatDate(rawDate);

    return (
      <RectButton
        onPress={() => {
          navigation.navigate("Edit Punch", { index });
        }}
        style={styles.itemContainer}
      >
        <View style={styles.dateContainer}>
          <Text
            style={styles.date}
          >{`${date.month} ${date.day}${date.suffix}`}</Text>
          <Text style={styles.dayOfWeek}>{date.dayOfWeek}</Text>
        </View>
        <View style={styles.punchContainer}>
          <RectButton
            onPress={() => {
              if (rawPunchIn.getTime() === 0) {
                dispatch(punchIn(index));
              }
            }}
            style={styles.punchItem}
          >
            <Icon
              name={"login"}
              size={32}
              style={{ color: colors.SECONDARY_GREEN }}
            />
            <Text style={styles.time}>{formatDate(rawPunchIn).time}</Text>
          </RectButton>
          <RectButton
            onPress={() => handlePunchOut(rawPunchIn, rawPunchOut, index)}
            style={styles.punchItem}
          >
            <Icon
              name={"logout"}
              size={32}
              style={{ color: colors.SECONDARY_RED }}
            />
            <Text style={styles.time}>{formatDate(rawPunchOut).time}</Text>
          </RectButton>
          <View style={styles.punchItem}>
            <Icon
              name={"schedule"}
              size={32}
              style={{ color: colors.SECONDARY_PURPLE }}
            />
            <Text style={styles.time}>
              {calculateHours(rawPunchIn.getTime(), rawPunchOut.getTime())}
            </Text>
          </View>
        </View>
      </RectButton>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: ({ pressColor, pressOpacity }) => (
        <BorderlessButton
          activeOpacity={pressOpacity}
          onPress={() => setShowMore(!showMore)}
          rippleColor={pressColor}
        >
          <Icon color={colors.PRIMARY_WHITE} name={"more-vert"} size={28} />
        </BorderlessButton>
      ),
    });
  }, [navigation, showMore]);

  return (
    <View style={styles.root}>
      <AnimatedLayout style={{ flex: 1 }}>
        <SectionList
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          keyExtractor={(item, index) => `${item.date}${index}`}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          sections={sectionedData}
          SectionSeparatorComponent={() => <View style={{ height: 2 }} />}
        />
        {showMore && (
          <AnimatedBaseButton
            entering={FadeInUp.duration(150)}
            exiting={FadeOutUp.duration(150)}
            onPress={() => setShowMore(false)}
            rippleColor={"transparent"}
            style={{
              height: "100%",
              position: "absolute",
              width: "100%",
            }}
          >
            <Animated.View style={styles.moreContainer}>
              <RectButton onPress={handleCalculateHours}>
                <Text style={styles.moreText}>Calculate Hours</Text>
              </RectButton>
            </Animated.View>
          </AnimatedBaseButton>
        )}
        <PanGestureHandler onGestureEvent={animatedGestureEvent}>
          <Animated.View style={[animatedButton, styles.newDateWrapper]}>
            <BaseButton onPress={createDay} style={styles.newDateButton}>
              <Icon color={colors.PRIMARY_WHITE} name={"add"} size={50} />
            </BaseButton>
          </Animated.View>
        </PanGestureHandler>
      </AnimatedLayout>
    </View>
  );
};

export default Punches;
