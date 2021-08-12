import { StyleSheet } from "react-native";
import { colors } from "../../utils/constants";

export default StyleSheet.create({
  date: {
    alignSelf: "center",
    color: colors.PRIMARY_WHITE,
    fontSize: 18,
  },
  dateContainer: { alignItems: "center", flex: 1 },
  dateHeader: {
    color: colors.PRIMARY_WHITE,
    fontSize: 24,
    marginBottom: 10,
  },
  presetBreakButton: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  presetBreakContainer: {
    backgroundColor: colors.BLACK,
    borderColor: "red",
    borderRadius: 15,
    borderWidth: 2,
    overflow: "hidden",
    width: 65,
  },
  presetBreakText: {
    color: colors.PRIMARY_WHITE,
    fontSize: 20,
    textAlign: "center",
  },
  root: {
    alignSelf: "center",
    flex: 1,
    paddingHorizontal: "5%",
    width: "100%",
  },
  rowContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  settingsText: {
    color: colors.PRIMARY_WHITE,
    fontSize: 18,
  },
  statisticHeader: {
    color: colors.PRIMARY_WHITE,
    fontSize: 24,
    textAlign: "left",
  },
  statisticText: {
    backgroundColor: colors.BLACK,
    borderRadius: 8,
    color: colors.PRIMARY_WHITE,
    flex: 2,
    fontSize: 24,
    paddingHorizontal: 10,
    textAlign: "center",
  },
});
