import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  date: { fontSize: 20, fontWeight: "bold" },
  dateContainer: {
    flex: 1,
  },
  dayOfWeek: { fontSize: 18, marginLeft: 2 },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    alignItems: "center",
    backgroundColor: colors.BORDER,
    flexDirection: "row",
    height: 65,
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  moreContainer: {
    backgroundColor: colors.BACKGROUND,
    borderColor: "#222222",
    borderWidth: 2,
    position: "absolute",
    right: 0,
    width: 200,
  },
  moreText: {
    color: colors.PRIMARY_WHITE,
    fontSize: 18,
    padding: 8,
    textAlign: "left",
  },
  newDateButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  newDateWrapper: {
    alignItems: "center",
    backgroundColor: colors.PRIMARY_PURPLE,
    borderRadius: 75 / 2,
    bottom: 50,
    height: 75,
    justifyContent: "center",
    overflow: "hidden",
    position: "absolute",
    right: 50,
    width: 75,
  },
  punchContainer: {
    flex: 1.5,
    flexDirection: "row",
    height: "90%",
    justifyContent: "space-evenly",
  },
  punchItem: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    width: 50,
  },
  root: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: colors.BACKGROUND,
    color: colors.PRIMARY_WHITE,
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 15,
  },
  time: {
    color: colors.BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
});
