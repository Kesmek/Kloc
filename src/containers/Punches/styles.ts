import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export const SEPARATOR_HEIGHT = 2;
export const ITEM_HEIGHT = 65;

export default StyleSheet.create({
  button: {
    alignItems: "center",
    height: ITEM_HEIGHT,
    justifyContent: "center",
    width: "100%",
  },
  date: { color: colors.BLACK, fontSize: 18, fontWeight: "bold" },
  dateContainer: {
    flex: 1,
  },
  dayOfWeek: { fontSize: 18 },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    alignItems: "center",
    backgroundColor: colors.BORDER,
    flexDirection: "row",
    height: ITEM_HEIGHT,
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  moreContainer: {
    backgroundColor: colors.BACKGROUND,
    borderBottomWidth: 3,
    borderColor: colors.BLACK,
    borderLeftWidth: 3,
    position: "absolute",
    right: 0,
    width: 225,
  },
  moreText: {
    color: colors.PRIMARY_WHITE,
    fontSize: 18,
    padding: 8,
    textAlign: "left",
  },
  newDateWrapper: {
    alignItems: "center",
    backgroundColor: colors.PRIMARY_PURPLE,
    height: ITEM_HEIGHT,
    justifyContent: "center",
    width: "100%",
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
