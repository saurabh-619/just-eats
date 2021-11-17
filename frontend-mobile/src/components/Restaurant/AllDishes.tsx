import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { UserRole } from "../../apollo/__generated__/globalTypes";
import { DishType, MenuType } from "../../utils/types";
import NotAvailable from "../NotAvailable";
import { colorConstants, fontConstants } from "./../../utils/styles";
import { ActionBtns } from "./ActionBtns";
import DishCard from "./owner/DishCard";

interface IAllDishesProps extends MenuType {
  role: UserRole;
  restaurantId: number;
}

export const AllDishes: React.FC<IAllDishesProps> = ({
  menu,
  role,
  restaurantId,
}) => {
  const [isOrderingStarted, setStartOrdering] = useState(false);

  return (
    <View style={styles.allDishesContainer}>
      <View style={[t.mB5]}>
        <Text style={styles.heading}>Dishes</Text>
        <ActionBtns
          role={role}
          restaurantId={restaurantId}
          isOrderingStarted={isOrderingStarted}
          setStartOrdering={setStartOrdering}
        />
      </View>
      {menu?.length === 0 ? (
        <NotAvailable text="No dishes on the menu" />
      ) : (
        menu?.map((dish: DishType) => (
          <DishCard
            key={dish.id}
            dish={dish}
            isOrderingStarted={isOrderingStarted}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allDishesContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontFamily: fontConstants.bold,
    color: colorConstants.primary,
  },
  list: {
    backgroundColor: "#999",
  },
  noDishWrapper: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
