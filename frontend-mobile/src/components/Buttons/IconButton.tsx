import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colorConstants } from "../../utils/styles";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IIconButtonProps {
  icon: string;
  onClick: () => void;
  color?: string;
  size?: number;
}

const IconButton: React.FC<IIconButtonProps> = ({
  icon,
  onClick,
  color = colorConstants.success,
  size = 35,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btnWrapper,
        {
          borderColor: color,
          borderWidth: 2,
          height: size + 10,
          width: size + 10,
        },
      ]}
      activeOpacity={0.5}
      onPress={onClick}
    >
      {/* @ts-ignore */}
      <Feather name={icon} color={color} size={size} />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  btnWrapper: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
