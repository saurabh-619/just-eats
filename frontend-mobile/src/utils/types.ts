import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  GetAllRestaurants_allRestaurants_restaurants,
  GetAllRestaurants_allRestaurants_restaurants_category,
} from "../apollo/__generated__/GetAllRestaurants";
import {
  MyRestaurantQuery_myRestaurant_restaurant,
  MyRestaurantQuery_myRestaurant_restaurant_menu,
  MyRestaurantQuery_myRestaurant_restaurant_menu_options,
} from "../apollo/__generated__/MyRestaurantQuery";
import { RestaurantQuery_restaurant_restaurant } from "../apollo/__generated__/RestaurantQuery";
import { MyRestaurantQuery_myRestaurant_restaurant_orders } from "./../../../frontend-web/src/__generated__/MyRestaurantQuery";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  About: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Restaurant: {
    restaurant: RestaurantType;
  };

  // Client
  Restaurants: undefined;
  OrderNotificationClient: {
    orderId: number;
  };
  //Owner
  MyRestaurants: undefined;
  AddRestaurant: undefined;
  OrderNotificationOwner: {
    orderId: number;
  };
  OwnerDashboard: undefined;

  // Driver
  DriverDashboard: undefined;
  OrderNotificationDriver: {
    orderId: number;
  };
};

export type SplashNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Splash"
>;

export type HomeNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type AboutNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "About"
>;

export type LoginNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export type RegisterNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export type ProfileNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;

export type RestaurantNavigationPros = NativeStackScreenProps<
  RootStackParamList,
  "Restaurant"
>;

// Client
export type RestaurantsNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "Restaurants"
>;

export type OrderNotificationClientNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "OrderNotificationClient"
>;

// Owner
export type MyRestaurantsNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "MyRestaurants"
>;
export type AddRestaurantNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "AddRestaurant"
>;

export type OrderNotificationOwnerNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "OrderNotificationOwner"
>;
export type OwnerDashboardNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "OwnerDashboard"
>;

// Driver
export type DriverDashboardNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "DriverDashboard"
>;
export type OrderNotificationDriverNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  "OrderNotificationDriver"
>;

// Datebase types
export interface RestaurantType
  extends GetAllRestaurants_allRestaurants_restaurants {}

export interface CategoryType
  extends GetAllRestaurants_allRestaurants_restaurants_category {}

export interface MyRestaurantDetailsType
  extends MyRestaurantQuery_myRestaurant_restaurant {}

export interface RestaurantDetailsType
  extends RestaurantQuery_restaurant_restaurant {}

export interface DishType
  extends MyRestaurantQuery_myRestaurant_restaurant_menu {}

export interface OptionType
  extends MyRestaurantQuery_myRestaurant_restaurant_menu_options {}

export interface MenuType {
  menu: DishType[];
}

export interface OrderType
  extends MyRestaurantQuery_myRestaurant_restaurant_orders {}
