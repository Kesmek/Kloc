import { Alert, Keyboard, StyleSheet, Text, View } from "react-native";
import { EditEmployerNavigationProps } from "src/types/navigation";
import { BaseButton, TextInput } from "react-native-gesture-handler";
import { RefObject, useEffect, useRef, useState } from "react";
import { Colors } from "src/utils/constants";
import IconButton from "src/components/IconButton";
import { useObject, useRealm } from "src/backend/utils";
import Employer from "src/backend/models/Employer";
import { Realm } from "@realm/react";

type Props = EditEmployerNavigationProps;

const EditEmployer = ({ navigation, route }: Props) => {
  const realm = useRealm();
  const employer = useObject(
    Employer,
    route.params.id
      ? new Realm.BSON.ObjectId(route.params.id)
      : new Realm.BSON.ObjectId(),
  );

  const nameInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const [name, setName] = useState(employer?.name);
  const [description, setDescription] = useState(employer?.description);

  const focusRef = (ref: RefObject<TextInput>) => {
    ref.current?.focus();
  };

  const confirmEmployer = () => {
    if (name) {
      if (employer?.name) {
        realm.write(() => {
          employer.name = name;
        });
      } else {
        realm.write(() => {
          realm.create(
            "Employer",
            Employer.generate(
              name,
              description,
            ),
          );
        });
      }
      navigation.removeListener(
        "beforeRemove",
        () => {
        },
      );
      navigation.goBack();
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete this employer and ALL data related to them, delete it anyway?",
      [
        {
          text: "Delete",
          onPress: deleteEmployer,
        },
        {
          text: "cancel",
          style: "cancel",
        },
      ],
    );
  };

  const deleteEmployer = () => {
    if (employer?.name) {
      realm.write(() => {
        realm.delete(employer);
      });
      navigation.removeListener(
        "beforeRemove",
        () => {
        },
      );
      navigation.goBack();
    }
  };

  useEffect(
    () =>
      navigation.addListener(
        "beforeRemove",
        (e) => {
          if (!!name && name !== employer?.name) {
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
    [employer?.name, name, navigation],
  );

  return (
    <BaseButton style={styles.root} onPress={Keyboard.dismiss} rippleColor={"transparent"}>
      <Text style={styles.label} onPress={() => focusRef(nameInputRef)}>Name</Text>
      <TextInput
        ref={nameInputRef}
        style={styles.input}
        autoComplete={"name"}
        placeholder={"Employer Name"}
        onChangeText={setName}
        value={name}
        autoCapitalize={"words"}
        onSubmitEditing={() => focusRef(descriptionInputRef)}
      />
      <Text style={styles.label} onPress={() => focusRef(nameInputRef)}>Description</Text>
      <TextInput
        ref={descriptionInputRef}
        style={[
          styles.input, {
            width: "90%",
          },
        ]}
        placeholder={"Employer Description"}
        multiline={true}
        onChangeText={setDescription}
        autoCapitalize={"sentences"}
        value={description}
        onSubmitEditing={confirmEmployer}
      />
      <View style={styles.buttonRow}>
        <IconButton
          name="check"
          size={40}
          style={[
            styles.buttonWrapper, {
              opacity: !!name && name !== employer?.name ? 1 : 0.25,
            },
          ]}
          color={Colors.GREEN}
          enabled={!!name && name !== employer?.name}
          onPress={confirmEmployer}
        />
        <IconButton
          name="delete"
          size={40}
          style={[
            styles.buttonWrapper, {
              borderColor: Colors.RED,
              opacity: employer?.name ? 1 : 0.25,
            },
          ]}
          enabled={!!employer?.name}
          color={Colors.RED}
          onPress={confirmDelete}
        />
      </View>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-evenly" },
  buttonWrapper: {
    width: 80,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: Colors.GREEN,
    borderWidth: 2,
  },
  label: {
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.CARD,
    borderColor: Colors.BORDER,
    borderWidth: 2,
    width: "60%",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default EditEmployer;
