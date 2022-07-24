import { EditShiftNavigationProps } from "../types/navigation";
import { useObject, useRealm } from "../backend/utils";
import Shift from "../backend/models/Shift";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../utils/constants";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  BaseButton,
  BorderlessButton,
  RectButton,
  TextInput,
} from "react-native-gesture-handler";
import { formatDurationString } from "../utils/time";
import { useDuration } from "../hooks/useDuration";
import IconButton from "../components/IconButton";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type Props = EditShiftNavigationProps;

const EditShift = ({ navigation, route }: Props) => {
  const realm = useRealm();
  const shift = useObject<Shift>(
    "Shift",
    new Realm.BSON.ObjectId(route.params.id),
  )!;

  const [notes, setNotes] = useState(shift.notes);
  const [start, setStart] = useState(shift.start);
  const [end, setEnd] = useState(shift.end);

  const duration = useDuration(
    start,
    end,
  ) as Duration;

  const saveAndExit = useCallback(
    () => {
      realm.write(() => {
        shift.edited
          = shift.edited || shift.end?.getTime() !== end?.getTime() || shift.start.getTime() !== start.getTime();
        shift.end = end;
        shift.start = start;
        shift.notes = notes;
      });
      navigation.goBack();
    },
    [end, navigation, notes, realm, shift, start],
  );

  const saveButton = useCallback(
    () => {
      return (
        <BorderlessButton onPress={saveAndExit} style={{ padding: 2 }}>
          <Icon name="save" size={25} color={Colors.TEXT_DARK} />
        </BorderlessButton>
      );
    },
    [saveAndExit],
  );

  const handleEndShift = () => {
    realm.write(() => {
      shift.end = new Date();
    });
  };

  const deleteShift = () => {
    Alert.alert(
      "Are You Sure?",
      "This will delete this shift permanently, continue?",
      [
        {
          text: "delete",
          onPress: () => {
            navigation.removeListener(
              "beforeRemove",
              () => {
              },
            );
            realm.write(() => {
              realm.delete(shift);
            });
            navigation.goBack();
          },
        },
        {
          text: "keep",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const isTimeEdited = useCallback(
    () => {
      return shift.start.getTime() !== start?.getTime() || shift.end?.getTime() !== end?.getTime();
    },
    [end, shift.end, shift.start, start],
  );

  const isEdited = useCallback(
    () => {
      return isTimeEdited() || shift.notes !== notes;
    },
    [isTimeEdited, notes, shift.notes],
  );

  const editStart = () => {
    DateTimePickerAndroid.open({
      mode: "time", value: shift.start, onChange: updateStart, maximumDate: end,
    });
  };

  const editEnd = () => {
    if (!shift.end) {
      return;
    }
    DateTimePickerAndroid.open({
      mode: "time", value: shift.end, onChange: updateEnd,
    });
  };

  const updateStart = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (!date) {
      return;
    }

    if ((end && date > end) || date > new Date()) {
      return Alert.alert("Error", "Cannot set a start time that is after the" +
        " end time or the current time.");
    }

    setStart(date);
  };

  const updateEnd = (
    event: DateTimePickerEvent,
    date?: Date,
  ) => {
    if (!date) {
      return;
    }

    if (date < start) {
      return Alert.alert("Error", "Cannot set an end time that is before the" +
        " start time.");
    }

    setEnd(date);
  };

  useEffect(
    () =>
      navigation.addListener(
        "beforeRemove",
        (e) => {
          if (isEdited()) {
            e.preventDefault();
          } else {
            return;
          }

          Alert.alert(
            "Are You Sure?",
            "Going back now will discard any changed you've made, are you sure?",
            [
              {
                text: "discard",
                onPress: () => navigation.dispatch(e.data.action),
              },
              {
                text: "stay",
                style: "cancel",
              },
            ],
            {
              cancelable: true,
            },
          );
        },
      ),
    [isEdited, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: format(
        shift.start,
        `MMM do, EEE.${isTimeEdited() ? "*" : ""}`,
      ),
      headerRight: saveButton,
    });
  }, [isTimeEdited, navigation, saveButton, shift.start]);

  if (!shift) {
    return null;
  }
  return (
    <BaseButton
      onPress={Keyboard.dismiss} style={styles.root} rippleColor={"transparent"}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Icon name="add-alarm" size={30} color={Colors.GREEN} />
          <Text style={styles.headerText}>{"Start"}</Text>
        </View>
        <View style={styles.timeContainer}>
          <RectButton style={styles.button} onPress={editStart}>
            <Text
              style={styles.time}
            >{format(
              start,
              "EEEE, MMMM do",
            )}</Text>
            <Text
              style={styles.time}
            >{format(
              start,
              "h:mm a",
            )}</Text>
          </RectButton>
        </View>
        <View style={styles.header}>
          <Icon name="alarm-on" size={30} color={Colors.RED} />
          <Text style={styles.headerText}>{"End"}</Text>
        </View>
        {end ? (
          <View style={styles.timeContainer}>
            <RectButton style={styles.button} onPress={editEnd}>
              <Text
                style={styles.time}
              >{format(
                end,
                "EEEE, MMMM do",
              )}</Text>
              <Text
                style={styles.time}
              >{format(
                end,
                "h:mm a",
              )}</Text>
            </RectButton>
          </View>
        ) : (
          <IconButton
            name="alarm-on"
            size={30}
            color={Colors.RED}
            style={styles.shiftButton}
            onPress={handleEndShift}
          >
            <Text>
              End Now?
            </Text>
          </IconButton>
        )}
        <View style={styles.header}>
          <Icon name="schedule" size={30} color={Colors.SECONDARY} />
          <Text style={styles.headerText}>{"Duration"}</Text>
        </View>
        <View style={styles.timeContainer}>
          <RectButton style={styles.button}>
            <Text
              style={styles.time}
            >{formatDurationString(
              duration ?? Date.now(),
              "l",
            )}</Text>
          </RectButton>
        </View>
        <View style={styles.header}>
          <Icon name="edit" size={30} color={Colors.PRIMARY_LIGHT} />
          <Text style={styles.headerText}>{"Notes"}</Text>
        </View>
        <TextInput
          autoCapitalize={"sentences"}
          multiline={true}
          style={[styles.timeContainer, styles.textInput]}
          onChangeText={setNotes}
          value={notes}
          maxLength={250}
          disallowInterruption={true}
        />
        <IconButton
          name="delete"
          size={30}
          color={Colors.RED}
          style={styles.delete}
          onPress={deleteShift}
        />
      </KeyboardAvoidingView>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 5,
  },
  header: {
    flexDirection: "row",
    marginBottom: 5,
  },
  headerText: {
    color: Colors.TEXT_LIGHT,
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 5,
  },
  timeContainer: {
    borderColor: Colors.PRIMARY_DARK,
    borderWidth: 2,
    backgroundColor: Colors.CARD,
    width: "55%",
    marginLeft: 5,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  time: {
    fontSize: 16,
    paddingHorizontal: 2,
    color: Colors.TEXT_LIGHT,
    borderColor: Colors.PRIMARY,
  },
  shiftButton: {
    height: 50,
    width: "30%",
    borderRadius: 10,
    borderColor: Colors.RED,
    borderWidth: 1,
  },
  textInput: {
    width: "80%",
    paddingHorizontal: 10,
  },
  delete: {
    width: 100,
    height: 50,
    borderColor: Colors.RED,
    borderWidth: 2,
    borderRadius: 10,
    alignSelf: "center",
  },
});

export default EditShift;
