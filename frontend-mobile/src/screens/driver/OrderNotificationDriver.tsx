import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { t } from "react-native-tailwindcss";
import {
  EDIT_ORDER_MUTATION,
  GET_ORDER_QUERY,
  ORDER_SUBSCRIPTION,
} from "../../apollo/queries";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
} from "../../apollo/__generated__/EditOrderMutation";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
} from "../../apollo/__generated__/GetOrderQuery";
import { OrderStatus } from "../../apollo/__generated__/globalTypes";
import { OrderUpdatesSub } from "../../apollo/__generated__/OrderUpdatesSub";
import LightButton from "../../components/Buttons/LightButton";
import PageLoader from "../../components/PageLoader";
import {
  appColors,
  colorConstants,
  commonStyles,
  fontConstants,
} from "../../utils/styles";
import { OrderNotificationDriverNavigationProps } from "../../utils/types";

const OrderNotificationDriver: React.FC<OrderNotificationDriverNavigationProps> =
  ({
    navigation,
    route: {
      params: { orderId },
    },
  }) => {
    const { data, subscribeToMore, loading } = useQuery<
      GetOrderQuery,
      GetOrderQueryVariables
    >(GET_ORDER_QUERY, {
      variables: {
        input: {
          id: orderId,
        },
      },
    });

    useEffect(() => {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: { input: { id: orderId } },
        onError: (err: Error) => {
          console.log({ apolloError: err.message });
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSub } }
        ) => {
          console.log({ prev, currOrder: data.orderUpdate });
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...prev.getOrder.order,
                ...data.orderUpdate,
              },
            },
          };
        },
      });
    }, [data]);
    console.log({ data });

    const [editOrderMutation, { loading: isMutating }] = useMutation<
      EditOrderMutation,
      EditOrderMutationVariables
    >(EDIT_ORDER_MUTATION, {
      onError: (err: ApolloError) => console.log({ err: err.message }),
    });

    const onActionBtnClicked = (newStatus: OrderStatus) => {
      editOrderMutation({
        variables: {
          input: {
            id: orderId,
            status: newStatus,
          },
        },
      });
    };

    if (loading) {
      return <PageLoader />;
    }

    return (
      <View style={[commonStyles.appContainer]}>
        <Text style={styles.topHeading}>Track order</Text>
        <View style={[t.flex1, t.justifyCenter]}>
          <LinearGradient
            colors={["#06221b", "#000000"]}
            style={styles.container}
          >
            <Text style={[t.textWhite, t.fontBold, t.text5xl, t.textCenter]}>
              ${data?.getOrder.order?.total}
            </Text>
            <View style={[t.mT5, t.w40, t.bgWhite, t.h1, t.selfCenter]} />
            <View style={styles.contentWrapper}>
              <View style={styles.rowContainer}>
                <Text style={styles.contentText}>{">"} Order id</Text>
                <Text style={styles.contentText}>#{orderId}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.contentText}>{">"} Prepared by</Text>
                <Text style={styles.contentText}>
                  {data?.getOrder.order?.restaurant?.name}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.contentText}>{">"} Customer</Text>
                <Text style={styles.contentText}>
                  {data?.getOrder.order?.customer?.email}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.contentText}>{">"} Driver</Text>
                <Text style={styles.contentText}>
                  {data?.getOrder.order?.driver?.email || "not available yet."}
                </Text>
              </View>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <View style={styles.btnWrapper}>
                  <LightButton
                    text="Picked up"
                    isLight={false}
                    onClick={() => onActionBtnClicked(OrderStatus.PickedUp)}
                    loading={isMutating}
                  />
                </View>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <View style={styles.btnWrapper}>
                  <LightButton
                    text="Order delivered"
                    isLight={false}
                    onClick={() => onActionBtnClicked(OrderStatus.Delivered)}
                    loading={isMutating}
                  />
                </View>
              )}
              {data?.getOrder.order?.status === OrderStatus.Delivered && (
                <View style={styles.btnWrapper}>
                  <Text style={[appColors.success]}>
                    Thank you for using just eats
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

export default OrderNotificationDriver;

const styles = StyleSheet.create({
  topHeading: {
    fontSize: 24,
    fontFamily: fontConstants.bold,
  },
  container: {
    height: 450,
    width: "100%",
    paddingVertical: 50,
    paddingHorizontal: 7,
    borderRadius: 12,
    elevation: 10,
  },
  contentWrapper: {
    marginTop: 50,
    width: "90%",
    alignSelf: "center",
    alignItems: "flex-start",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  contentText: {
    color: colorConstants.secondary,
    fontSize: 16,
    marginTop: 10,
  },
  btnWrapper: {
    marginTop: 50,
    alignSelf: "center",
  },
});
