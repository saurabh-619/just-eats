import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { colorConstants, fontConstants } from "../../../utils/styles";
import { OrderType } from "../../../utils/types";
import NotAvailable from "../../NotAvailable";

interface ISalesProps {
  orders: OrderType[];
}

export const Sales: React.FC<ISalesProps> = ({ orders }) => {
  return (
    <View style={styles.allDishesContainer}>
      <Text style={styles.heading}>Sales</Text>
      {orders?.length === 0 ? (
        <NotAvailable text="No sales yet." />
      ) : (
        <VictoryChart style={styles.chart} theme={VictoryTheme.material}>
          <VictoryLine
            interpolation="natural"
            data={orders?.slice(orders.length - 10).map((order) => ({
              x: dayjs(order.createdAt).format("DD MMM"),
              y: order.total,
            }))}
          />
        </VictoryChart>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allDishesContainer: {
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  heading: {
    fontSize: 22,
    fontFamily: fontConstants.bold,
    color: colorConstants.primary,
  },
  chart: {},
});
