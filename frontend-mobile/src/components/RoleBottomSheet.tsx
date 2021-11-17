import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { UserRole } from "../apollo/__generated__/globalTypes";
import { colorConstants } from "../utils/styles";

interface IRoleBottomSheet {
  setRoleValue: React.Dispatch<React.SetStateAction<UserRole>>;
  bottomSheetOffset: Animated.SharedValue<number>;
}

const { width, height } = Dimensions.get("window");

const RoleBottomSheet: React.FC<IRoleBottomSheet> = ({
  setRoleValue,
  bottomSheetOffset,
}) => {
  const closeSheet = () => {
    bottomSheetOffset.value = 1000;
  };

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(bottomSheetOffset.value, { mass: 0.3 }),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.container, animationStyle]}>
      <View style={styles.opacityContainer}></View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.role}
          onPress={() => {
            closeSheet();
            setRoleValue(UserRole.Client);
          }}
        >
          <Text style={styles.text}>Client</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.role}
          onPress={() => {
            closeSheet();
            setRoleValue(UserRole.Owner);
          }}
        >
          <Text style={styles.text}>Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.role}
          onPress={() => {
            closeSheet();
            setRoleValue(UserRole.Delivery);
          }}
        >
          <Text style={styles.text}>Driver</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default RoleBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: 0,
    zIndex: 10,
  },
  opacityContainer: {
    flex: 1,
    backgroundColor: colorConstants.black,
    opacity: 0.1,
    width: "100%",
  },
  bottomContainer: {
    height: 200,
    width: "100%",
    backgroundColor: colorConstants.white,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  role: {
    padding: 10,
    width: 300,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: colorConstants.white,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});
