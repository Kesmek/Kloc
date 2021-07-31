import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 15,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.PRIMARY_WHITE,
    alignSelf: "center",
  },
  punchContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  punchText: {
    flex: 1,
    color: colors.PRIMARY_WHITE,
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  time: {
    flex: 1,
    color: colors.BLACK,
    height: 35,
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: colors.SECONDARY_GREEN,
    fontWeight: "bold",
    marginHorizontal: 10,
    textAlignVertical: "center",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.PRIMARY_GREEN,
    width: 75,
    height: 75,
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 75 / 2,
  },
  buttonText: { fontSize: 30, fontWeight: "bold" },
});
