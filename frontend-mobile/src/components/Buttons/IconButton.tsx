import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorConstants } from "../../utils/styles";

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
