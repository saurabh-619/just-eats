import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colorConstants } from "../utils/styles";

interface IPageLoader {
  color?: string;
  size?: number;
}

const PageLoader: React.FC<IPageLoader> = ({
  color = colorConstants.primary,
  size = 38,
}) => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
};

export default PageLoader;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colorConstants.bg,
    justifyContent: "center",
  },
});
