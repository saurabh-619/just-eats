import { useMutation, useSubscription } from "@apollo/client";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { COOKED_ORDERS_SUB, TAKE_ORDER_MUTATION } from "../../apollo/queries";
import { CookedOrdersSub } from "../../apollo/__generated__/CookedOrdersSub";
import {
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../apollo/__generated__/TakeOrderMutation";
import AppHeader from "../../components/AppHeader";
import AppLoader from "../../components/AppLoader";
import {
  colorConstants,
  commonStyles,
  fontConstants,
} from "../../utils/styles";
import { DriverDashboardNavigationProps } from "../../utils/types";

const DriverDashboard: React.FC<DriverDashboardNavigationProps> = ({
  navigation,
}) => {
  const { data: cookedSubData } =
    useSubscription<CookedOrdersSub>(COOKED_ORDERS_SUB);

  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      navigation.navigate("OrderNotificationDriver", {
        orderId: cookedSubData?.cookedOrder.id!,
      });
    }
  };

  const [takeOrderMutation, { loading }] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };

  return (
    <View style={commonStyles.appContainer}>
      <AppHeader heading="dashboard" />
      {!cookedSubData?.cookedOrder ? (
        <View style={styles.textWrapper}>
          <Text style={styles.text}>looking for pickups ...</Text>
        </View>
      ) : (
        <View style={styles.pickupWrapper}>
          <Text style={styles.title}>New pickup 😀</Text>
          <LinearGradient colors={["#f857a6", "#ff5858"]} style={styles.card}>
            <View style={styles.contentWrapper}>
              <View style={[t.flexRow, t.itemsCenter]}>
                <Feather name="map-pin" style={styles.icon} size={13} />
                <Text style={styles.rest}>
                  {cookedSubData.cookedOrder.restaurant?.name}
                </Text>
              </View>
              <View style={[t.flexRow, t.itemsCenter, t.mT2]}>
                <Feather
                  name="mail"
                  style={[styles.icon, t.textPink200, t.textSm]}
                />
                <Text style={[styles.rest, t.textPink200, t.textBase]}>
                  {cookedSubData.cookedOrder.customer.email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.btnWrapper]}
              activeOpacity={0.5}
              onPress={() => triggerMutation(cookedSubData.cookedOrder.id)}
            >
              {loading ? (
                <AppLoader size={13} />
              ) : (
                <Feather
                  name={"truck"}
                  color={colorConstants.white}
                  size={15}
                />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default DriverDashboard;

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
