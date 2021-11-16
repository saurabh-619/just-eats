import { StyleSheet } from "react-native";
import { t } from "react-native-tailwindcss";

export enum DirTypes {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
}
export const fontConstants = {
  light: "nunitoLight",
  regular: "nunitoRegular",
  bold: "nunitoBold",
};

export const colorConstants = {
  bg: "#F4EEFF",
  bgLight: "#fbf8ff",
  bgDark: "#dcd6e6",
  primary: "#424874",
  secondary: "#A6B1E1",
  white: "#ffffff",
  black: "#000000",
  gray: "#6d6875",
  error: "#FF2442",
  success: "#1FAB89",
};

export const appColors = StyleSheet.create({
  bg: {
    color: colorConstants.bg,
  },
  primary: {
    color: colorConstants.primary,
  },
  secondary: {
    color: colorConstants.secondary,
  },
  white: {
    color: colorConstants.white,
  },
  black: {
    color: colorConstants.black,
  },
  gray: {
    color: colorConstants.gray,
  },
  dark: t.textGray700,
  light: t.textGray600,
  error: {
    color: colorConstants.error,
  },
  success: {
    color: colorConstants.success,
  },
});

export const commonStyles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 55,
    backgroundColor: colorConstants.bg,
  },
  appTitle: {
    fontSize: 35,
    fontFamily: fontConstants.bold,
    color: colorConstants.primary,
  },
  appHeading: {
    fontSize: 22,
    fontFamily: fontConstants.bold,
    color: colorConstants.black,
  },
  appSubHeading: {
    fontSize: 18,
    fontFamily: fontConstants.light,
    color: colorConstants.black,
  },
  appBody: {
    fontSize: 16,
    fontFamily: fontConstants.light,
    color: colorConstants.black,
  },
  appSubtitle: {
    fontSize: 14,
    fontFamily: fontConstants.light,
    color: colorConstants.black,
  },
  pH10: {
    paddingHorizontal: 10,
  },
  pH20: {
    paddingHorizontal: 20,
  },
  pH40: {
    paddingHorizontal: 40,
  },
  pV10: {
    paddingVertical: 10,
  },
  pV20: {
    paddingVertical: 20,
  },
  pV40: {
    paddingVertical: 40,
  },
  mH10: {
    marginHorizontal: 10,
  },
  mH20: {
    marginHorizontal: 20,
  },
  mH40: {
    marginHorizontal: 40,
  },
  mV10: {
    marginVertical: 10,
  },
  mV20: {
    marginVertical: 20,
  },
  mV40: {
    marginVertical: 40,
  },
});

export const getMarginTop = (value: number) => {
  return StyleSheet.create({
    margin: {
      marginTop: value,
    },
  });
};

export const getMarginBottom = (value: number) => {
  return StyleSheet.create({
    margin: {
      marginBottom: value,
    },
  });
};

export const getMarginLeft = (value: number) => {
  return StyleSheet.create({
    margin: {
      marginLeft: value,
    },
  });
};

export const getMarginRight = (value: number) => {
  return StyleSheet.create({
    margin: {
      marginRight: value,
    },
  });
};
