import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import About from "../screens/About";
import OrderNotificationClient from "../screens/client/OrderNotificationClient";
import DriverDashboard from "../screens/driver/DriverDashboard";
import OrderNotificationDriver from "../screens/driver/OrderNotificationDriver";
import Login from "../screens/Login";
import AddRestaurant from "../screens/owner/AddRestaurant";
import MyRestaurants from "../screens/owner/MyRestaurants";
import OrderNotificationOwner from "../screens/owner/OrderNotificationOwner";
import OwnerDashboard from "../screens/owner/OwnerDashboard";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Restaurant from "../screens/Restaurant";
import Splash from "../screens/Splash";
import { rootStackNavigationOptions } from "../utils/config";
import { RootStackParamList } from "../utils/types";
import Restaurants from "./../screens/client/Restaurants";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={rootStackNavigationOptions}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profile" component={Profile} />

        {/* Props with params */}
        <Stack.Screen name="Restaurant" component={Restaurant} />

        {/* Client */}
        <Stack.Screen name="Restaurants" component={Restaurants} />
        <Stack.Screen
          name="OrderNotificationClient"
          component={OrderNotificationClient}
        />

        {/* Owner */}
        <Stack.Screen name="MyRestaurants" component={MyRestaurants} />
        <Stack.Screen name="AddRestaurant" component={AddRestaurant} />
        <Stack.Screen
          name="OrderNotificationOwner"
          component={OrderNotificationOwner}
        />
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />

        {/* Driver */}
        <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
        <Stack.Screen
          name="OrderNotificationDriver"
          component={OrderNotificationDriver}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
