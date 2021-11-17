import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { appColors, colorConstants, fontConstants } from "../../utils/styles";

interface IResturantHeaderProps {
  restName?: string;
  restCoverImg?: string;
  categoryName?: string;
  categoryCoverImg?: string;
  address?: string;
}

export const ResturantHeader: React.FC<IResturantHeaderProps> = ({
  address,
  restName,
  restCoverImg,
  categoryCoverImg,
  categoryName,
}) => {
  return (
    <View style={styles.header}>
      <Image source={{ uri: restCoverImg }} style={styles.image} />
      <LinearGradient
        colors={["rgba(0,0,0,1)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0.35 }}
        style={styles.overlay}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.restaurantName}>{restName}</Text>
        <View style={[t.flexRow, t.justifyBetween]}>
          <View style={[t.flexRow]}>
            <Image
              style={styles.categoryImage}
              source={{ uri: categoryCoverImg }}
            />
            <Text style={[styles.address, t.textWhite, t.opacity75, t.mL1]}>
              {categoryName}
            </Text>
          </View>
          <Text style={[styles.address, appColors.secondary]}>
            <Feather name="map-pin" style={[styles.icon]} /> {address}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "relative",
  },
  image: {
    height: 250,
    width: "100%",
  },
  overlay: {
    zIndex: 1,
    height: 250,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  restaurantName: {
    fontSize: 28,
    color: colorConstants.bgLight,
    fontFamily: fontConstants.bold,
    marginBottom: 10,
  },
  textWrapper: {
    paddingHorizontal: 25,
    position: "absolute",
    left: 0,
    bottom: 13,
    zIndex: 2,
    width: "100%",
  },
  categoryImage: {
    height: 22,
    width: 22,
    borderRadius: 11,
    marginRight: 5,
  },
  address: {
    fontSize: 16,
  },
  icon: {
    fontSize: 16,
    color: colorConstants.secondary,
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
});
