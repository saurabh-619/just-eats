import { ApolloError, useMutation } from "@apollo/client";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_ORDER_MUTATION } from "../../../apollo/queries";
import {
  CreateOrderMutation,
  CreateOrderMutationVariables,
} from "../../../apollo/__generated__/CreateOrderMutation";
import { setError, setSuccess } from "../../../redux/slices/msgSlice";
import { resetOrder } from "../../../redux/slices/orderSlice";
import { RootState } from "../../../redux/store";
import { colorConstants, fontConstants } from "../../../utils/styles";
import { RootStackParamList } from "../../../utils/types";
import AppLoader from "../../AppLoader";
import IconButton from "../../Buttons/IconButton";

interface IClientButtonProps {
  restaurantId: number;
  isOrderingStarted: boolean;
  setStartOrdering: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientButton: React.FC<IClientButtonProps> = ({
  restaurantId,
  isOrderingStarted,
  setStartOrdering,
}) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Restaurant">>();
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.value);
  const total = useSelector((state: RootState) => state.order.total);

  const handleStartOrder = () => {
    setStartOrdering(true);
  };

  const handleNewDishNavigate = () => {};

  const handleCancelOrder = () => {
    dispatch(resetOrder());
    setStartOrdering(false);
    dispatch(setSuccess({ msg: "Order was cancelled successfully." }));
  };

  const confirmOrder = () => {
    const items = order.map((dish) => ({
      dishId: dish.dishId,
      options: dish.options.map((opt) => ({
        name: opt.name,
      })),
    }));
    if (Platform.OS === "android") {
      Alert.alert("Do you want us to proceed?", undefined, [
        { text: "cancel", onPress: () => {} },
        {
          text: "proceed",
          style: "destructive",
          onPress: () => {
            console.log("proceed");
            createOrderMutation({
              variables: {
                input: {
                  items,
                  restaurantId,
                },
              },
            });
          },
        },
      ]);
    } else {
      Alert.prompt("Are you sure?", undefined, [
        { text: "cancel", onPress: () => {} },
        {
          text: "proceed",
          style: "destructive",
          onPress: () => {
            createOrderMutation({
              variables: {
                input: {
                  items,
                  restaurantId,
                },
              },
            });
          },
        },
      ]);
    }
  };
  const handleTriggerOrder = () => {
    if (order.length === 0) {
      return dispatch(
        setError({ msg: "You need to add atleast one dish to the order." })
      );
    }
    confirmOrder();
  };

  const onPlacingTheOrder = (data: CreateOrderMutation) => {
    const { ok, error, orderId } = data.createOrder;

    if (error) {
      return setError({
        msg: error,
      });
    }

    navigation.navigate("OrderNotificationClient", { orderId: orderId! });
  };
  const [createOrderMutation, { loading: isPlacingOrder }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted: onPlacingTheOrder,
    onError: (err: ApolloError) => console.log({ err: err.message }),
  });

  return isPlacingOrder ? (
    <AppLoader color={colorConstants.success} />
  ) : (
    <View style={styles.btnWrapper}>
      {isOrderingStarted && <Text style={styles.totalPrice}>${total}</Text>}
      <View style={t.mL3}>
        {isOrderingStarted ? (
          <IconButton icon="check" onClick={handleTriggerOrder} size={15} />
        ) : (
          <IconButton icon="plus" onClick={handleStartOrder} size={15} />
        )}
      </View>
      {isOrderingStarted ? (
        <View style={[t.mL3]}>
          <IconButton
            icon="x"
            onClick={handleCancelOrder}
            size={15}
            color={colorConstants.error}
          />
        </View>
      ) : null}
    </View>
  );
};

export default ClientButton;

const styles = StyleSheet.create({
  totalPrice: {
    fontSize: 20,
    fontFamily: fontConstants.bold,
    color: colorConstants.primary,
  },
  btnWrapper: {
    width: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
});
