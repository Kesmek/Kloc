import { EditShiftNavigationProps } from "src/types/navigation";
import { useObject, useRealm } from "src/backend/utils";
import Shift from "src/backend/models/Shift";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { Colors } from "src/utils/constants";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BaseButton, BorderlessButton, RectButton, TextInput } from "react-native-gesture-handler";
import { formatDurationString } from "src/utils/time";
import { useDuration } from "src/hooks/useDuration";
import IconButton from "src/components/IconButton";

type Props = EditShiftNavigationProps;

const EditShift = ({ navigation, route }: Props) => {
  const realm = useRealm();
  const shift = useObject(
    Shift,
    new Realm.BSON.ObjectId(route.params.id),
  )!;

  const [notes, setNotes] = useState(shift.notes);
  const [start, setStart] = useState(shift.start);
  const [end, setEnd] = useState(shift.end);

  const duration = useDuration(
    start,
    end,
  ) as Duration;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: format(
        shift.start,
        `MMM do, EEE.${shift.edited ? "*" : ""}`,
      ),
      headerRight: saveButton,
    });
  });

  const saveButton = () => {
    return (
      <BorderlessButton onPress={saveAndExit} style={{ padding: 2 }}>
        <Icon name="save" size={25} color={Colors.TEXT_DARK}/>
      </BorderlessButton>
    );
  };

  const saveAndExit = () => {
    realm.write(() => {
      shift.end = end;
      shift.start = start;
      shift.notes = notes;
      shift.edited = shift.edited || shift.end?.getTime() !== end?.getTime() || shift.start.getTime() !== start.getTime();
    });
    navigation.goBack();
  };

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
            navigation.goBack();
            realm.write(() => {
              realm.delete(shift);
            });
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

  const isEdited = useCallback(
    () => {
      if (shift.end) {
        return shift.start.getTime() !== start?.getTime() || shift.end.getTime() !== end?.getTime() || shift.notes !== notes;
      } else {
        return shift.start.getTime() !== start?.getTime() || shift.notes !== notes;
      }
    },
    [end, notes, shift, start],
  );

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

  if (!shift) {
    return null;
  }
  return (
    <BaseButton onPress={Keyboard.dismiss} style={styles.root} rippleColor={"transparent"}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Icon name="add-alarm" size={30} color={Colors.GREEN}/>
          <Text style={styles.headerText}>{"Start"}</Text>
        </View>
        <View style={styles.timeContainer}>
          <RectButton style={styles.button}>
            <Text
              style={styles.time}
            >{format(
              shift.start,
              "EEEE, MMMM do",
            )}</Text>
            <Text
              style={styles.time}
            >{format(
              shift.start,
              "h:mm a",
            )}</Text>
          </RectButton>
        </View>
        <View style={styles.header}>
          <Icon name="alarm-on" size={30} color={Colors.RED}/>
          <Text style={styles.headerText}>{"End"}</Text>
        </View>
        {shift.end ? (
          <View style={styles.timeContainer}>
            <RectButton style={styles.button}>
              <Text
                style={styles.time}
              >{format(
                shift.end,
                "EEEE, MMMM do",
              )}</Text>
              <Text
                style={styles.time}
              >{format(
                shift.end,
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
          <Icon name="schedule" size={30} color={Colors.SECONDARY}/>
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
          <Icon name="edit" size={30} color={Colors.PRIMARY_LIGHT}/>
          <Text style={styles.headerText}>{"Notes"}</Text>
        </View>
        <TextInput
          autoCapitalize={"sentences"}
          multiline={true}
          style={[styles.timeContainer, styles.textInput]}
          onChangeText={setNotes}
          value={notes}
          maxLength={250}
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
