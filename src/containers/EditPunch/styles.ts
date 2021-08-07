import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.PRIMARY_GREEN,
    borderRadius: 75 / 2,
    height: 75,
    justifyContent: "center",
    marginTop: 20,
    width: 75,
  },
  buttonText: { fontSize: 30, fontWeight: "bold" },
  date: {
    // alignSelf: "center",
    color: colors.PRIMARY_WHITE,
    fontSize: 20,
    fontWeight: "bold",
  },
  notesInput: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 10,
    fontSize: 17,
    marginTop: 5,
    paddingHorizontal: 10,
    width: "100%",
  },
  punchContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  punchText: {
    alignItems: "center",
    color: colors.PRIMARY_WHITE,
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    textAlignVertical: "center",
  },
  root: {
    flex: 1,
    paddingHorizontal: 15,
  },
  time: {
    backgroundColor: colors.SECONDARY_GREEN,
    borderRadius: 10,
    color: colors.BLACK,
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    height: 35,
    marginHorizontal: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
