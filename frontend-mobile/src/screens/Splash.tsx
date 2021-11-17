import { ApolloError, useQuery } from "@apollo/client";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { ME_QUERY } from "../apollo/queries";
import { MeQuery } from "../apollo/__generated__/MeQuery";
import { setUser } from "../redux/slices/userSlice";
import { initialNavigation } from "../utils/helpers";
import { SplashNavigationProps } from "../utils/types";

const Splash: React.FC<SplashNavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const onUserFetchingError = (_: ApolloError) => {
    setTimeout(() => navigation.replace("Login"), 2000);
  };

  const onUserFetched = (data: MeQuery) => {
    dispatch(setUser(data.me));
    setTimeout(() => initialNavigation(data.me.role, navigation), 2000);
  };

  useQuery<MeQuery>(ME_QUERY, {
    onCompleted: onUserFetched,
    onError: onUserFetchingError,
  });

  return (
    <View style={styles.container}>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
