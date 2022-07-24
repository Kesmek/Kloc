import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { EmployerPickerNavigationProps } from "../types/navigation";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Colors } from "../utils/constants";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQuery } from "../backend/utils";
import Employer from "../backend/models/Employer";
import { Realm } from "@realm/react";

type Props = EmployerPickerNavigationProps;

const EmployerPicker = ({ navigation }: Props) => {
  const employers = useQuery<Employer>("Employer");

  const handleEditEmployer = (id?: Realm.BSON.ObjectId) => {
    navigation.navigate(
      "Edit Employer",
      { id: id?.toHexString() },
    );
  };

  const renderItem: ListRenderItem<Employer> = ({ item }) => {
    return (
      <View
        style={styles.buttonWrapper}
      >
        <RectButton
          style={styles.button}
          onPress={() => navigation.navigate(
            "Shifts",
            { name: item.name, year: new Date().getFullYear() },
          )}
        >
          <View
            style={styles.card}
          >
            <View
              style={styles.itemWrapper}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View
              style={styles.editButton}
            >
              <BorderlessButton
                onPress={() => handleEditEmployer(item._id)}
              >
                <Icon name="more-vert" size={30} />
              </BorderlessButton>
            </View>
          </View>
        </RectButton>
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={styles.buttonWrapper}
      >
        <RectButton
          style={styles.addButton}
          onPress={() => handleEditEmployer()}
        >
          <Icon name="work" size={40} />
          <Icon name="add" size={30} style={styles.iconOverlay} />
        </RectButton>
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={employers}
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContent}
      ListFooterComponent={renderFooter}
      ListFooterComponentStyle={{ marginTop: 10 }}
      style={styles.flatList}
      ItemSeparatorComponent={renderSeparator}
    />
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: Colors.CARD,
    borderColor: Colors.BORDER,
    borderWidth: 2,
    height: 100,
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    padding: 10,
  },
  itemWrapper: {
    flex: 3,
  },
  editButton: {
    flex: 1,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 10,
  },
  addButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
    width: "100%",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    marginLeft: 5,
    fontSize: 14,
  },
  separator: { height: 10 },
  flatListContent: { flexGrow: 1, padding: 10 },
  flatList: { flex: 1 },
  iconOverlay: {
    position: "absolute",
    color: Colors.BORDER,
    paddingTop: 5,
  },
});

export default EmployerPicker;
