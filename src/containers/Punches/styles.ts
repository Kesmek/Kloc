import { StyleSheet } from "react-native";

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  punchContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    // borderWidth: 2,
  },
  punchItem: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 2,
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
  },
  date: { fontSize: 20, fontWeight: "bold" },
  dayOfWeek: { fontSize: 16, marginLeft: 2 },
});
