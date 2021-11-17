import { Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { t } from "react-native-tailwindcss";
import { appColors, colorConstants, fontConstants } from "../utils/styles";
import { RestaurantType, RootStackParamList } from "../utils/types";

interface IResturantCardProps {
  item: RestaurantType;
}

const RestaurantCard: React.FC<IResturantCardProps> = ({
  item: { id, name, address, isPromoted, category, coverImg },
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onClick = () => {
    navigation.navigate("Restaurant", {
      restaurant: {
        id,
        name,
        address,
        isPromoted,
        category,
        coverImg,
      } as RestaurantType,
    });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onClick}
      activeOpacity={0.85}
    >
      <Image source={{ uri: coverImg }} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.textWrapper}>
        <View style={[t.flexRow]}>
          <Image
            style={styles.categoryImage}
            source={{ uri: category?.coverImg! }}
          />
          <Text style={[styles.address, appColors.light, t.mR3]}>
            {category?.name}
          </Text>
          <Text style={[styles.address, appColors.light]}>
            <Feather name="map-pin" style={[styles.icon, appColors.light]} />{" "}
            {address}
          </Text>
        </View>
        {isPromoted && (
          <View style={styles.ad}>
            <Text style={styles.adText}>Ad</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  cardContainer: {
    height: 220,
    width: "100%",
    backgroundColor: colorConstants.white,
    borderRadius: 7,
    elevation: 3,
    shadowColor: colorConstants.gray,
    shadowOffset: { width: 0.5, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  image: {
    height: "70%",
    width: "100%",
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  name: {
    paddingHorizontal: 15,
    marginTop: 6,
    fontSize: 18,
    fontFamily: fontConstants.bold,
    color: colorConstants.primary,
  },
  textWrapper: {
    paddingHorizontal: 15,
    marginTop: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  address: {
    fontSize: 15,
  },
  icon: {
    fontSize: 15,
  },
  ad: {
    borderWidth: 1,
    borderColor: colorConstants.success,
    borderRadius: 2,
    width: 35,
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  adText: {
    fontSize: 12,
    color: colorConstants.success,
  },
  categoryImage: {
    height: 20,
    width: 20,
    borderRadius: 20,
    marginRight: 5,
  },
});
