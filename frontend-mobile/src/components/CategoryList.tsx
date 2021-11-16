import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorConstants, fontConstants } from "../utils/styles";
import { CategoryType } from "../utils/types";

interface ICategoryListProps {
  categories: CategoryType[];
}

const CategoryList: React.FC<ICategoryListProps> = ({ categories }) => {
  return (
    <View style={styles.categoryListContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryContainer}
          activeOpacity={0.4}
        >
          <Image style={styles.image} source={{ uri: category.coverImg! }} />
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  categoryListContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  categoryContainer: {
    marginRight: 10,
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: colorConstants.bgLight,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 33,
    width: 33,
    borderRadius: 20,
  },
  categoryName: {
    fontSize: 13,
    fontFamily: fontConstants.regular,
    color: colorConstants.primary,
  },
});
