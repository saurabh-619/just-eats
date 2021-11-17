import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { HomeNavigationProps } from "../utils/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ALL_RESTAURANTS } from "../apollo/queries";
import {
  GetAllRestaurant,
  GetAllRestaurantVariables,
} from "../apollo/__generated__/GetAllRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { setUser, UserState } from "../redux/slices/userSlice";

const Home: React.FC<HomeNavigationProps> = ({ navigation }) => {
  const userState = useSelector<UserState>((state) => state);
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery<
    GetAllRestaurant,
    GetAllRestaurantVariables
  >(GET_ALL_RESTAURANTS, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  console.log({ userState });

  const handleButtonClicked = () => {
    // navigation.navigate("About");
    dispatch(setUser({ email: "saurabh@gmail.com", verified: true }));
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TouchableOpacity onPress={handleButtonClicked} style={styles.button}>
        <Text style={styles.text}>Go to about</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

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
