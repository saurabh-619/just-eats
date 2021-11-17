import React from "react";
import { StyleSheet, View } from "react-native";
import { UserRole } from "../../apollo/__generated__/globalTypes";
import ClientButton from "./client/ClientButton";
import OwnerButton from "./owner/OwnerButton";

interface IActionBtnsProps {
  role?: UserRole;
  restaurantId: number;
  isOrderingStarted: boolean;
  setStartOrdering: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActionBtns: React.FC<IActionBtnsProps> = ({
  role,
  isOrderingStarted,
  setStartOrdering,
  restaurantId,
}) => {
  return (
    <View style={styles.btnWrapper}>
      {role === UserRole.Client && (
        <ClientButton
          restaurantId={restaurantId}
          isOrderingStarted={isOrderingStarted}
          setStartOrdering={setStartOrdering}
        />
      )}
      {role === UserRole.Owner && <OwnerButton />}
    </View>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 1,
  },
});
