import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colorConstants } from "../utils/styles";

interface ICategoryModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryName: React.Dispatch<React.SetStateAction<string>>;
}

const categoriesAllowed = [
  {
    name: "Indian",
    img: "https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Indian_CuisineCarousel@2x.png",
  },
  {
    name: "Chinese",
    img: "https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Chinese_CuisineCarousel@2x.png",
  },
  {
    name: "BBQ",
    img: "https://tb-static.uber.com/prod/web-eats-v2/categories/icons/Taiwanese_CuisineCarousel@2x.png",
  },

  {
    name: "Snacks",
    img: "https://tb-static.uber.com/prod/web-eats-v2/categories/icons/FastFood_CuisineCarousel@2x.png",
  },
];
const CategoryModal: React.FC<ICategoryModalProps> = ({
  modalVisible,
  setModalVisible,
  setCategoryName,
}) => {
  const toggleModal = () => setModalVisible(!modalVisible);

  const handleCategoryClicked = (category: string) => {
    setCategoryName(category);
    setModalVisible(!modalVisible);
  };

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={toggleModal}
      transparent={true}
    >
      <View style={styles.modalContainer}>
        {categoriesAllowed.map((cat) => (
          <TouchableOpacity
            style={styles.categoryRow}
            onPress={() => handleCategoryClicked(cat.name)}
            activeOpacity={0.5}
            key={cat.name}
          >
            <Image
              source={{ uri: cat.img }}
              style={styles.img}
              resizeMode="cover"
            />
            <Text style={styles.text}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default CategoryModal;

const styles = StyleSheet.create({
  modalContainer: {
    height: 200,
    backgroundColor: colorConstants.white,
    paddingVertical: 20,
    marginTop: "auto",
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 3,
    width: "100%",
  },
  img: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  text: {
    color: colorConstants.primary,
    fontSize: 16,
  },
});
