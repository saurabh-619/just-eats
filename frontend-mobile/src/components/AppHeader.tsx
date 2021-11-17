import { NavigationProp } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppUser } from "../hooks/useAppUser";
import { getAvatar } from "../utils/helpers";
import { colorConstants, commonStyles } from "../utils/styles";
import { RootStackParamList } from "../utils/types";

interface IAppHeaderProps {
  heading: string;
}

const AppHeader: React.FC<IAppHeaderProps> = ({ heading }) => {
  const { user } = useAppUser();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleProfileClicked = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={styles.header}>
      <Text style={commonStyles.appTitle}>{heading}</Text>
      <Pressable onPress={handleProfileClicked}>
        <View style={styles.avatarBg}>
          <Image
            //@ts-ignore
            source={getAvatar(user?.role!)}
            style={styles.image}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    height: 25,
    width: 25,
  },
  avatarBg: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: colorConstants.bgLight,
    justifyContent: "center",
    alignItems: "center",
  },
});
