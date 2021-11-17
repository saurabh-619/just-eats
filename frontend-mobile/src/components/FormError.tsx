import React from "react";
import { StyleSheet, Text } from "react-native";
import { appColors } from "../utils/styles";

interface IFormErrorProps {
  message: string;
}

const FormError: React.FC<IFormErrorProps> = ({ message }) => {
  return <Text style={styles.error}>*{message}</Text>;
};

export default FormError;

const styles = StyleSheet.create({
  error: {
    ...appColors.error,
    fontSize: 12,
    marginVertical: 8,
  },
});
