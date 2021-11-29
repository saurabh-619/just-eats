import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { t } from "react-native-tailwindcss";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderItem,
  removeOrderItem,
} from "../../../redux/slices/orderSlice";
import { RootState } from "../../../redux/store";
import { DishType, OptionType } from "../../../utils/types";
import Pill from "../Pill";
import { appColors, colorConstants } from "./../../../utils/styles";

interface IDishCardProps {
  dish: DishType;
  isOrderingStarted: boolean;
}

const DishCard: React.FC<IDishCardProps> = ({ dish, isOrderingStarted }) => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.value);

  const [isOrderItem, setIsOrderItem] = useState(false);

  const handleDishClicked = () => {
    if (isOrderingStarted) {
      isOrderItem
        ? dispatch(removeOrderItem({ dishId: dish.id, price: dish.price }))
        : dispatch(
            addOrderItem({ dishId: dish.id, price: dish.price, options: [] })
          );
    }
  };

  useEffect(() => {
    setIsOrderItem(order.find((item) => item.dishId === dish.id) !== undefined);
  }, [order.length]);

  return (
    <View
      style={[
        styles.dishCardContainer,
        {
          backgroundColor: isOrderItem
            ? colorConstants.black
            : colorConstants.white,
        },
      ]}
    >
      <TouchableOpacity onPress={handleDishClicked} activeOpacity={0.85}>
        <Image source={{ uri: dish.photo! }} style={styles.dishImage} />
      </TouchableOpacity>
      <View style={styles.contentWrapper}>
        <Text style={[t.textLg, isOrderItem ? t.textWhite : t.textGray800]}>
          {dish.name}
        </Text>
        <Text
          style={[
            isOrderItem ? t.textGray500 : t.textGray600,
            t.mT1,
            styles.dishDesc,
          ]}
        >
          {dish.desc.length > 50
            ? `${dish.desc.substring(0, 50)}...`
            : dish.desc}
        </Text>
        <View style={styles.priceWrapper}>
          <Text
            style={[
              isOrderItem ? appColors.success : appColors.primary,
              t.mT1,
              t.fontBold,
              t.textLg,
            ]}
          >
            ${dish.price}
          </Text>
          {isOrderItem && (
            <View style={styles.pillWrapper}>
              {dish.options?.map((option: OptionType) => (
                <Pill key={option.name} option={option} dish={dish} />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default DishCard;

const styles = StyleSheet.create({
  dishCardContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 110,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: colorConstants.white,
    borderRadius: 12,
    elevation: 1,
  },
  dishImage: {
    height: 75,
    width: 75,
    borderRadius: 40,
    marginRight: 15,
  },
  contentWrapper: {
    justifyContent: "flex-start",
    height: "100%",
    width: "70%",
  },
  dishDesc: {
    fontSize: 13,
    width: "65%",
  },
  priceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  pillWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
});
