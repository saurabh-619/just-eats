import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorConstants, fontConstants } from "../../utils/styles";
import AppLoader from "../AppLoader";

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
    minWidth: 130,
    textAlign: "center",
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 10,
  },
  btnText: {
    fontSize: 16,
    fontFamily: fontConstants.bold,
  },
});
