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
  punchContainer: { flex: 1, alignItems: "center" },
  punchText: {
    color: colors.GREEN,
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  punchInput: {
    color: colors.PRIMARY_WHITE,
    fontSize: 20,
  },
});
