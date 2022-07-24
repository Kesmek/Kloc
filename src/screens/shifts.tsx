import {
  Alert,
  ListRenderItem,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ShiftsNavigationProps } from "../types/navigation";
import { Colors } from "../utils/constants";
import IconButton from "../components/IconButton";
import { useCallback, useEffect } from "react";
import ShiftEntry from "../components/ShiftEntry";
import { useObject, useQuery, useRealm } from "../backend/utils";
import Shift from "../backend/models/Shift";
import {
  formatDurationString,
  formatIntervalString,
  getMonthName,
} from "../utils/time";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDuration } from "../hooks/useDuration";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Realm } from "@realm/react";

type Props = ShiftsNavigationProps

const Shifts = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const realm = useRealm();
  const allShifts = useQuery<Shift>("Shift")
  .sorted(
    "start",
    true,
  );
  const shifts = allShifts.filtered(`year == ${route.params.year}`);
  const activeShifts = allShifts.filtered("end == null")?.[0];
  const activeShift = useObject<Shift>(
    "Shift",
    activeShifts?._id ?? new Realm.BSON.ObjectId(),
  );
  const duration = useDuration(
    activeShift?.start,
    activeShift?.end,
  );

  const active = useDerivedValue(
    () => {
      return !!activeShift;
    },
    [activeShift],
  );
  const animatedStyle = useAnimatedStyle(() => {
    if (active.value) {
      return {
        width: withTiming(frame.width - 10),
        borderRadius: withTiming(10),
        marginHorizontal: 5,
        zIndex: 3,
      };
    } else {
      return {
        width: withTiming(0),
      };
    }
  });

  const getSections = useCallback(
    () => {
      const sections = [];
      for (let i = 11; i >= 0; i--) {
        const monthShifts = shifts.filtered(`month == ${i}`)
        .toJSON();
        sections.push({
          data: monthShifts,
          key: getMonthName(i),
        });
      }
      return sections;
    },
    [shifts],
  );

  const handleEndShift = () => {
    if (activeShift) {
      realm.write(() => {
        activeShift.end = new Date();
      });
    }
  };

  const deleteShift = (id: Realm.BSON.ObjectId) => {
    const shift = shifts.filtered(
      `_id == $0`,
      id,
    );
    realm.write(() => {
      realm.delete(shift);
    });
  };

  const renderSectionHeader = ({ section }: {
    section: SectionListData<Shift>
  }) => {
    if (section.data.length) {
      return (
        <Text style={styles.sectionHeader}>{(section.key)}</Text>
      );
    } else {
      return null;
    }
  };

  const renderSectionSeparator = () => <View style={styles.sectionSeparator} />;

  const renderItemSeparator = () => <View style={styles.itemSeparator} />;

  const renderItem: ListRenderItem<Shift> =
    ({ item }) => {
      if (item._id.equals(activeShift?._id ?? "")) {
        return (
          <ShiftEntry
            {...item}
            duration={formatDurationString(duration)}
            onPress={() => navigation.navigate(
              "Edit Shift",
              { id: item._id.toHexString() },
            )}
            onEndShift={handleEndShift}
          />
        );
      } else {
        return (
          <ShiftEntry
            {...item}
            duration={formatIntervalString({
              start: item.start, end: item.end ?? Number.MAX_SAFE_INTEGER,
            })}
            onPress={() => navigation.navigate(
              "Edit Shift",
              { id: item._id.toHexString() },
            )}
            onEndShift={handleEndShift}
          />
        );
      }
    };

  const addShift = () => {
    if (activeShift) {
      Alert.alert(
        "Ongoing Shift",
        "Cannot create a new shift because you already have an active shift!",
        [
          {
            text: "ok",
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    } else {
      realm.write(() => {
        const newShift = new Shift(realm, Shift.generate());
      });
    }
  };

  useEffect(
    () => {
      navigation.setOptions({
        headerTitle: `${route.params.name}, ${route.params.year}`,
      });
    },
    [navigation, route.params.name, route.params.year],
  );

  return (
    <>
      <SectionList
        sections={getSections()}
        style={styles.sectionList}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 76.5 },
        ]}
        renderSectionHeader={renderSectionHeader}
        SectionSeparatorComponent={renderSectionSeparator}
        ItemSeparatorComponent={renderItemSeparator}
        renderItem={renderItem}
        getItemLayout={(
          item,
          index,
        ) => {
          return {
            index,
            length: 70,
            offset: (70 + 5) * index,
          };
        }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
      />
      <Animated.View
        style={[styles.currentShift, { bottom: insets.bottom }, animatedStyle]}
      >
        {activeShift ? (
          <ShiftEntry
            start={activeShift.start}
            edited={activeShift.edited}
            onPress={() => navigation.navigate(
              "Edit Shift",
              { id: activeShift._id.toHexString() },
            )}
            duration={formatDurationString(duration)}
            onEndShift={handleEndShift}
            style={styles.activeShift}
            textStyle={styles.darkText}
            enabled={false}
          />
        ) : (
          <IconButton
            name={"add"}
            size={30}
            style={styles.addButton}
            onPress={addShift}
            color={Colors.TEXT_DARK}
            enabled={true}
          />
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionList: {
    flex: 1,
    marginTop: 3,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    width: 150,
    height: 25,
    fontSize: 18,
    backgroundColor: Colors.SECONDARY,
    textAlignVertical: "center",
    paddingHorizontal: 10,
    color: Colors.TEXT_DARK,
    borderRadius: 5,
    fontWeight: "bold",
  },
  activeShift: { flex: 1, flexDirection: "row", padding: 5 },
  darkText: {
    color: Colors.TEXT_DARK,
  },
  sectionSeparator: {
    height: 3,
  },
  itemSeparator: {
    height: 5,
  },
  addButton: {
    backgroundColor: Colors.PRIMARY_LIGHT,
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    alignSelf: "center",
    elevation: 3,
  },
  currentShift: {
    alignSelf: "center",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    height: 70,
    borderRadius: 5,
    borderColor: Colors.BACKGROUND,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
});

export default Shifts;
