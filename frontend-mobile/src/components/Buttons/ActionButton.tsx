import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorConstants, fontConstants } from "../../utils/styles";
import AppLoader from "../AppLoader";

interface IActionButtonProps {
  isLoading?: boolean;
  text: string;
  myStyles?: StyleProp<ViewStyle>;
  onClick: () => void;
}

const ActionButton: React.FC<IActionButtonProps> = ({
  isLoading = false,
  text,
  myStyles,
  onClick,
}) => {
  return (
    <TouchableOpacity
      style={[myStyles, styles.activityButton]}
      onPress={onClick}
      activeOpacity={0.85}
    >
      {isLoading ? <AppLoader /> : <Text style={styles.btnText}>{text}</Text>}
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  activityButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorConstants.primary,
    height: 50,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 16,
    fontFamily: fontConstants.bold,
    color: colorConstants.white,
  },
});
