import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  punchContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  punchItem: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    color: colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  date: { fontSize: 20, fontWeight: "bold" },
  dayOfWeek: { fontSize: 18, marginLeft: 2 },
  itemContainer: {
    backgroundColor: colors.BORDER,
    height: 65,
    alignItems: "center",
    paddingLeft: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateContainer: {
    flex: 1,
  },
  newDateButton: {
    width: 75,
    height: 75,
    backgroundColor: colors.PRIMARY_PURPLE,
    position: "absolute",
    bottom: 50,
    right: 50,
    borderRadius: 75 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
