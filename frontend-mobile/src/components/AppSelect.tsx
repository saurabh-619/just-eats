import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fontConstants } from "../utils/styles";
import { colorConstants } from "./../utils/styles";

interface IAppSelectprops {
  text: string;
  onPress: () => void;
}

const AppSelect: React.FC<IAppSelectprops> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.selectContainer}>
      <Text>{text}</Text>
      <Feather name="arrow-down" style={styles.icon} />
    </TouchableOpacity>
  );
};

export default AppSelect;

const styles = StyleSheet.create({
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: fontConstants.regular,
    backgroundColor: colorConstants.white,
    borderRadius: 6,
    marginTop: 20,
  },
  icon: {
    fontSize: 20,
    color: colorConstants.primary,
  },
});
