import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { UserRole } from "../apollo/__generated__/globalTypes";

import clientAvatar from "../../assets/images/client.png";
import chefAvatar from "../../assets/images/chef.png";
import deliveryAvatar from "../../assets/images/delivery.png";
import { BackHandler } from "react-native";

export const getLocalStorage = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const setLocalStorage = async (key: string, payload: any) => {
  await AsyncStorage.setItem(key, payload);
};

export const removeFromLocalStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const initialNavigation = (
  role: UserRole,
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    keyof RootStackParamList
  >
) => {
  if (role === UserRole.Client) {
    navigation.replace("Restaurants");
  } else if (role === UserRole.Owner) {
    navigation.replace("MyRestaurants");
  } else {
    navigation.replace("Dashboard");
  }
};

export const getAvatar = (role: UserRole) => {
  switch (role) {
    case UserRole.Client:
      return clientAvatar;

    case UserRole.Owner:
      return chefAvatar;

    case UserRole.Delivery:
      return deliveryAvatar;

    default:
      return clientAvatar;
  }
};

export const onBackPress = (cb: () => boolean) => {
  BackHandler.addEventListener("hardwareBackPress", cb);
  return () => BackHandler.removeEventListener("hardwareBackPress", cb);
};
