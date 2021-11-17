import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { t } from "react-native-tailwindcss";

interface IAppNotice {
  title?: string;
  body?: string;
}

const AppNotice: React.FC<IAppNotice> = ({ title, body }) => {
  const textOpacityAnim = useSharedValue(1);
  const containerHeightAnim = useSharedValue(70);
  const closeBtnScaleAnim = useSharedValue(1);

  const closeNotice = () => {
    textOpacityAnim.value = 0;
    containerHeightAnim.value = 0;
    closeBtnScaleAnim.value = 0;
  };

  const animatedContainerValue = useAnimatedStyle(() => {
    return {
      height: withTiming(containerHeightAnim.value, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  const animatedCloseBtnValue = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(closeBtnScaleAnim.value, {
            duration: 100,
            easing: Easing.out(Easing.exp),
          }),
        },
      ],
    };
  });

  const animatedOpacityValue = useAnimatedStyle(() => {
    return {
      opacity: withTiming(textOpacityAnim.value, {
        duration: 10,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  return (
    <Animated.View
      style={[styles.noticeContainer, t.bgYellow100, animatedContainerValue]}
    >
      <Animated.View style={[styles.textWrapper, animatedOpacityValue]}>
        {title && (
          <Text style={[t.textYellow600, t.fontBold, t.textBase]}>{title}</Text>
        )}
        {body && <Text style={[t.textYellow500, t.textXs, t.mT1]}>{body}</Text>}
      </Animated.View>
      <TouchableOpacity activeOpacity={0.5} onPress={closeNotice}>
        <Animated.View
          style={[styles.closeBtnWrapper, t.bgYellow300, animatedCloseBtnValue]}
        >
          <Feather name="x" style={[t.textYellow800, t.textSm]} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AppNotice;

const styles = StyleSheet.create({
  noticeContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    height: 67,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  textWrapper: {
    width: "90%",
  },
  closeBtnWrapper: {
    borderRadius: 5,
    padding: 7,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
