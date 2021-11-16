import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colorConstants } from "../utils/styles";

interface INotAvailableProps {
  text?: string;
  height?: number;
}
const NotAvailable: React.FC<INotAvailableProps> = ({
  text = "No items available",
  height = 100,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default NotAvailable;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: colorConstants.primary,
  },
});
