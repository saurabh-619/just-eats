import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderOption,
  removeOrderOption,
} from "../../redux/slices/orderSlice";
import { RootState } from "../../redux/store";
import { colorConstants } from "../../utils/styles";
import { DishType } from "../../utils/types";
import { OptionType } from "./../../utils/types";

interface IPillProps {
  option: Partial<OptionType>;
  dish: DishType;
}

const Pill: React.FC<IPillProps> = ({ option, dish }) => {
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.value);

  const handlePillClicked = () => {
    for (let i = 0; i < order.length; i++) {
      const item = order[i];
      if (
        item.dishId === dish.id &&
        item.options.find((opt) => opt.name === option.name) !== undefined
      ) {
        return dispatch(
          removeOrderOption({
            dishId: dish.id,
            extra: option.extra!,
            optionName: option.name!,
          })
        );
      }
    }
    dispatch(
      addOrderOption({
        dishId: dish.id,
        extra: option.extra!,
        optionName: option.name!,
      })
    );
  };

  useEffect(() => {
    setIsSelected(() => {
      for (let i = 0; i < order.length; i++) {
        const item = order[i];
        if (
          item.dishId === dish.id &&
          item.options.find((opt) => opt.name === option.name) !== undefined
        ) {
          return true;
        }
      }
      return false;
    });
  }, [order]);

  return (
    <TouchableOpacity
      style={[
        styles.pillContainer,
        {
          borderColor: isSelected ? colorConstants.white : colorConstants.gray,
        },
      ]}
      onPress={handlePillClicked}
    >
      <Text
        style={[
          styles.text,
          { color: isSelected ? colorConstants.white : colorConstants.gray },
        ]}
      >
        {option.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Pill;

const styles = StyleSheet.create({
  pillContainer: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 3,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
  },
});
