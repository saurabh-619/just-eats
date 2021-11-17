import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

interface IAppLoader {
  color?: string;
  size?: number;
}

const AppLoader: React.FC<IAppLoader> = ({ color = "#fff", size = 24 }) => {
  return <ActivityIndicator color={color} size={size} />;
};

export default AppLoader;

const styles = StyleSheet.create({});
