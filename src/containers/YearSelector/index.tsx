import { View, StyleSheet, ListRenderItem, Text } from "react-native";
import { RectButton, FlatList } from "react-native-gesture-handler";
import { useAppDispatch, useAppSelector } from "puncher/src/redux";
import {
  createSelectFocusedYear,
  setFocusedYear,
} from "puncher/src/redux/punches";
import { YearSelectorNavigationProps } from "puncher/src/types/navigation";
import { colors } from "puncher/src/utils/constants";

const years: number[] = [];

for (let i = new Date().getFullYear(); i >= 1900; i--) {
  years.push(i);
}

const YearPicker = ({ navigation }: YearSelectorNavigationProps) => {
  const focusedYear = useAppSelector(createSelectFocusedYear());
  const dispatch = useAppDispatch();

  const renderItem: ListRenderItem<number> = ({ item }) => {
    return item === focusedYear ? (
      <RectButton
        onPress={() => {
          dispatch(setFocusedYear({ year: item }));
          navigation.goBack();
        }}
        style={{
          alignContent: "center",
          height: 35,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.PRIMARY_PURPLE,
            fontSize: 26,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {item}
        </Text>
      </RectButton>
    ) : (
      <RectButton
        onPress={() => {
          dispatch(setFocusedYear({ year: item }));
          navigation.goBack();
        }}
        style={{
          alignContent: "center",
          height: 35,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: colors.PRIMARY_WHITE,
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {item}
        </Text>
      </RectButton>
    );
  };

  return (
    <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
      <RectButton
        activeOpacity={1}
        onPress={navigation.goBack}
        rippleColor={"transparent"}
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      />
      <View
        style={{
          backgroundColor: colors.BACKGROUND,
          borderColor: colors.BLACK,
          borderRadius: 10,
          borderWidth: 4,
          height: "50%",
          overflow: "hidden",
          width: "65%",
        }}
      >
        <Text
          style={{
            borderBottomColor: colors.BLACK,
            borderBottomWidth: 2,
            color: colors.PRIMARY_WHITE,
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Year
        </Text>
        <FlatList
          data={years}
          getItemLayout={(_, index) => ({
            index,
            length: 35,
            offset: 35 * index,
          })}
          keyExtractor={(item) => item}
          maxToRenderPerBatch={25}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default YearPicker;
