import { useSubscription } from "@apollo/client";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { PENDING_ORDERS_SUB } from "../../apollo/queries";
import { PendingOrdersSub } from "../../apollo/__generated__/PendingOrdersSub";
import AppHeader from "../../components/AppHeader";
import {
  colorConstants,
  commonStyles,
  fontConstants,
} from "../../utils/styles";
import { OwnerDashboardNavigationProps } from "../../utils/types";

const OwnerDashboard: React.FC<OwnerDashboardNavigationProps> = ({
  navigation,
}) => {
  const { data: pendingOrderSub } =
    useSubscription<PendingOrdersSub>(PENDING_ORDERS_SUB);

  const handleBtnClick = (orderId: number) => {
    navigation.navigate("OrderNotificationOwner", { orderId });
  };

  return (
    <View style={commonStyles.appContainer}>
      <AppHeader heading="dashboard" />
      {!pendingOrderSub?.pendingOrder ? (
        <View style={styles.textWrapper}>
          <Text style={styles.text}>looking for orders ...</Text>
        </View>
      ) : (
        <View style={styles.pickupWrapper}>
          <Text style={styles.title}>New order 😀</Text>
          <LinearGradient colors={["#f857a6", "#ff5858"]} style={styles.card}>
            <View style={styles.contentWrapper}>
              <View style={[t.flexRow, t.itemsCenter]}>
                <Feather name="mail" style={styles.icon} />
                <Text style={styles.rest}>
                  {pendingOrderSub?.pendingOrder.customer.email}
                </Text>
              </View>
              <View style={[t.flexRow, t.itemsCenter, t.mT2]}>
                <Feather
                  name="dollar-sign"
                  style={[styles.icon, t.textPink200, t.textSm]}
                  size={13}
                />
                <Text style={[styles.rest, t.textPink200, t.textBase]}>
                  {pendingOrderSub?.pendingOrder.total}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.btnWrapper]}
              activeOpacity={0.5}
              onPress={() => handleBtnClick(pendingOrderSub.pendingOrder.id)}
            >
              <FontAwesome5
                name={"concierge-bell"}
                color={colorConstants.white}
                size={15}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default OwnerDashboard;

const styles = StyleSheet.create({
  textWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontFamily: fontConstants.bold,
    textAlign: "center",
    color: colorConstants.success,
  },
  title: {
    paddingVertical: 30,
    marginTop: 50,
    fontSize: 18,
    color: colorConstants.success,
    fontFamily: fontConstants.bold,
  },
  pickupWrapper: {},
  card: {
    height: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  contentWrapper: {},
  rest: {
    fontSize: 17,
    color: colorConstants.white,
  },
  icon: {
    fontSize: 15,
    color: colorConstants.white,
    marginRight: 5,
  },
  btnWrapper: {
    borderColor: colorConstants.white,
    borderWidth: 2,
    height: 30,
    width: 30,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
