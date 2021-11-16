import React from "react";
import { StyleSheet, View } from "react-native";
import { colorConstants } from "../../../utils/styles";
import IconButton from "../../Buttons/IconButton";

const OwnerButton = () => {
  const handleNewDishNavigate = () => {};
  return (
    <View style={styles.btnWrapper}>
      <IconButton icon="plus" onClick={handleNewDishNavigate} size={15} />
      <IconButton
        icon="dollar-sign"
        onClick={handleNewDishNavigate}
        size={15}
        color={colorConstants.secondary}
      />
    </View>
  );
};

export default OwnerButton;

const styles = StyleSheet.create({
  btnWrapper: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "flex-end",
  },
});
