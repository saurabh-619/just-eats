import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AboutNavigationProps } from "../utils/types";

const About: React.FC<AboutNavigationProps> = ({ navigation }) => {
  const handleButtonClicked = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text>About</Text>
      <TouchableOpacity onPress={handleButtonClicked} style={styles.button}>
        <Text style={styles.text}>Go to home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 10,
    padding: 13,
    borderRadius: 10,
    backgroundColor: "teal",
  },
  text: {
    color: "#fff",
  },
});
