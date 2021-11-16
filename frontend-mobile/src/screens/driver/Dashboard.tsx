import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import AppHeader from "../../components/AppHeader";
import { resetToken } from "../../redux/slices/tokenSlice";
import { clearUser } from "../../redux/slices/userSlice";
import { TOKEN_KEY } from "../../utils/constants";
import { removeFromLocalStorage } from "../../utils/helpers";
import { commonStyles } from "../../utils/styles";
import { DashboardNavigationProps } from "../../utils/types";

const Dashboard: React.FC<DashboardNavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(clearUser());
    dispatch(resetToken());
    removeFromLocalStorage(TOKEN_KEY);
    navigation.replace("Login");
  };

  // setTimeout(logoutUser, 2000);

  return (
    <View style={commonStyles.appContainer}>
      <AppHeader heading="dashboard" />
      <Pressable
        onPress={() =>
          navigation.navigate("OrderNotificationDriver", { orderId: 55 })
        }
      >
        <Text>Check pickups</Text>
      </Pressable>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
