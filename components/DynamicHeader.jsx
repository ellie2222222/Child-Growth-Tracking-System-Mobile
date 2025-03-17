import { Animated, ImageBackground, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const Header_Max_Height = 150;
const Header_Min_Height = 90;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

export const DynamicHeader = ({ title, value }) => {
  const theme = useTheme();

  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animatedHeaderColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ["rgba(0,0,0,0)", theme.colors.primary],
    extrapolate: "clamp",
  });

  const animatedTitleColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ["black", "white"],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.header, { height: animatedHeaderHeight }]}>
      <ImageBackground
        source={require("../assets/bg.jpg")}
        style={styles.imageBackground}
        resizeMode="cover">
        <Animated.View
          style={[styles.overlay, { backgroundColor: animatedHeaderColor }]}
        />
        <Animated.Text
          style={[
            styles.title,
            {
              fontFamily: theme.fonts.medium.fontFamily,
              color: animatedTitleColor,
            },
          ]}>
          {title}
        </Animated.Text>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    overflow: "hidden",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "GothamRnd-Medium",
  },
});
