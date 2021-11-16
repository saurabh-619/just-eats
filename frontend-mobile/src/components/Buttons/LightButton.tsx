import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import AppLoader from "../AppLoader";
import { colorConstants, fontConstants } from "../../utils/styles";
import { DeviceWidth } from "../../utils/constants";

interface ILightButtonProps {
  loading?: boolean;
  isLight?: boolean;
  text: string;
  onClick?: () => void;
}
const LightButton: React.FC<ILightButtonProps> = ({
  text,
  onClick,
  loading,
  isLight = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.lightBtn,
        {
          justifyContent: loading ? "center" : "space-between",
          backgroundColor: isLight
            ? colorConstants.success
            : colorConstants.white,
        },
      ]}
      activeOpacity={0.85}
      onPress={onClick}
    >
      {loading ? (
        <AppLoader
          color={isLight ? colorConstants.white : colorConstants.primary}
        />
      ) : (
        <>
          <Text
            style={[
              styles.btnText,
              {
                color: isLight ? colorConstants.white : colorConstants.primary,
              },
            ]}
          >
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default LightButton;

const styles = StyleSheet.create({
  lightBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    minWidth: 80,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 10,
  },
  btnText: {
    fontSize: 16,
    fontFamily: fontConstants.bold,
  },
});
