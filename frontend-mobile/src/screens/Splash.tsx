import { ApolloError, useQuery } from "@apollo/client";
import AppLoading from "expo-app-loading";
import React from "react";
import { useDispatch } from "react-redux";
import { ME_QUERY } from "../apollo/queries";
import { MeQuery } from "../apollo/__generated__/MeQuery";
import { setUser } from "../redux/slices/userSlice";
import { initialNavigation } from "../utils/helpers";
import { SplashNavigationProps } from "../utils/types";

const Splash: React.FC<SplashNavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const onUserFetchingError = (_: ApolloError) => {
    navigation.replace("Login");
  };

  const onUserFetched = (data: MeQuery) => {
    dispatch(setUser(data.me));
    initialNavigation(data.me.role, navigation);
  };

  useQuery<MeQuery>(ME_QUERY, {
    onCompleted: onUserFetched,
    onError: onUserFetchingError,
  });

  return <AppLoading />;
};

export default Splash;
