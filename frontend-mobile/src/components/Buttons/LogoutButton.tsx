import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorConstants, fontConstants } from "../../utils/styles";
import AppLoader from "../AppLoader";

interface ILogoutButtonProps {
  loading: boolean;
  onClick: () => void;
}

const LogoutButton: React.FC<ILogoutButtonProps> = ({ loading, onClick }) => {
  return (
    <TouchableOpacity
      style={[
        styles.logoutBtn,
        {
          justifyContent: loading ? "center" : "space-between",
        },
      ]}
      activeOpacity={0.85}
      onPress={onClick}
    >
      {loading ? (
        <AppLoader color={colorConstants.black} />
      ) : (
        <>
          <Text style={styles.logoutText}>logout</Text>
          <Ionicons
            name="log-out"
            style={[styles.profileIcons, { marginRight: 0 }]}
          />
        </>
      )}
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 15,
    width: 100,
    borderRadius: 6,
    backgroundColor: colorConstants.white,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: fontConstants.bold,
    color: colorConstants.gray,
  },
  profileIcons: {
    fontSize: 20,
    color: colorConstants.gray,
    marginRight: 10,
  },
});
