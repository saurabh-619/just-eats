import { Feather, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { t } from "react-native-tailwindcss";
import { useDispatch } from "react-redux";
import { UserRole } from "../apollo/__generated__/globalTypes";
import AppNotice from "../components/AppNotice";
import IconButton from "../components/Buttons/IconButton";
import LightButton from "../components/Buttons/LightButton";
import LogoutButton from "../components/Buttons/LogoutButton";
import { useAppUser } from "../hooks/useAppUser";
import { setSuccess } from "../redux/slices/msgSlice";
import { resetToken } from "../redux/slices/tokenSlice";
import { clearUser } from "../redux/slices/userSlice";
import { TOKEN_KEY } from "../utils/constants";
import { getAvatar, removeFromLocalStorage } from "../utils/helpers";
import { ProfileNavigationProps } from "../utils/types";
import { appColors, colorConstants, commonStyles } from "./../utils/styles";

const Profile: React.FC<ProfileNavigationProps> = ({ navigation }) => {
  const { user } = useAppUser();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    setLoading(true);
    await removeFromLocalStorage(TOKEN_KEY);

    setTimeout(() => {
      dispatch(resetToken());
      navigation.replace("Login");
      dispatch(setSuccess({ msg: "Logged out successfully." }));
      dispatch(clearUser());
    }, 2000);
  };

  return (
    <View style={commonStyles.appContainer}>
      <Text style={commonStyles.appTitle}>Profile</Text>
      {!user?.verified && (
        <AppNotice
          title="Verify email"
          body="Go to the registered email and verify the mail-id, To enjoy all the features"
        />
      )}
      <View style={styles.imageWrapper}>
        <View style={styles.imgVeriWrapper}>
          <View style={styles.imageBg}>
            <Image
              //@ts-ignore
              source={getAvatar(user?.role!)}
              style={styles.image}
            />
          </View>
          {user?.verified && (
            <Ionicons name="checkmark-circle" style={styles.verifiedIcon} />
          )}
        </View>
      </View>
      <View style={styles.profileDetailsMail}>
        <Feather name="mail" style={styles.profileIcons} />
        <Text style={styles.detailText}>{user?.email}</Text>
      </View>
      <View style={styles.profileDetailsJoin}>
        <View style={[t.flexRow]}>
          <Feather name="calendar" style={[styles.profileIcons, t.mR5]} />
          <Text style={styles.detailText}>
            {dayjs(user?.createdAt).format("DD MMM, YYYY")}
          </Text>
        </View>
        {user?.role === UserRole.Owner && (
          <IconButton
            icon="bell"
            size={15}
            color={colorConstants.gray}
            onClick={() => navigation.navigate("OwnerDashboard")}
          />
        )}
      </View>
      <View style={[styles.btnWrapper, t.flexRow, t.justifyCenter]}>
        {user?.role === UserRole.Owner && (
          <LightButton
            text="Add new Restaurant"
            onClick={() => navigation.navigate("AddRestaurant")}
          />
        )}
        <LogoutButton loading={loading} onClick={logoutUser} />
      </View>
      <View style={[styles.aboutWrapper]}>
        <Text style={[commonStyles.appBody, appColors.dark, t.mX1]}>
          Team just eats
        </Text>
        <Text style={[commonStyles.appSubtitle, appColors.light, t.mX1]}>
          v1.0.0
        </Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  imageWrapper: {
    alignItems: "center",
  },
  imgVeriWrapper: {
    height: 200,
    position: "relative",
  },
  image: {
    marginTop: 5,
    height: 90,
    width: 90,
    marginBottom: 15,
  },
  imageBg: {
    marginTop: 30,
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: colorConstants.bgLight,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  verifiedIcon: {
    position: "absolute",
    bottom: 50,
    right: 0,
    zIndex: 1,
    fontSize: 32,
    color: colorConstants.success,
  },
  profileDetailsMail: {
    marginTop: 15,
    padding: 10,
    paddingLeft: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  profileDetailsJoin: {
    marginTop: 15,
    padding: 10,
    paddingLeft: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileIcons: {
    fontSize: 20,
    color: colorConstants.primary,
    marginRight: 20,
  },
  detailText: {
    fontSize: 18,
  },
  btnWrapper: {
    alignItems: "center",
    marginTop: 50,
  },
  aboutWrapper: {
    marginTop: 100,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
