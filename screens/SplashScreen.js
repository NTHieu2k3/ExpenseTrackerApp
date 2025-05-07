import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import LottieView from "lottie-react-native";
import { Button } from "react-native-paper";
import { GlobalStyles } from "../constants/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const pages = [
  {
    key: "1",
    animation: require("../assets/animations/track.json"),
    title: "Track Spending",
    text: "Track your expenses, easily manage your budget.",
  },
  {
    key: "2",
    animation: require("../assets/animations/plan.json"),
    title: "Plan Ahead",
    text: "Plan your future spending to stay on top of your finances.",
  },
  {
    key: "3",
    animation: require("../assets/animations/control.json"),
    title: "Stay in Control",
    text: "Take control of your finances with the right decisions.",
  },
];

export default function SplashScreenn() {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  return (
    <LinearGradient
      colors={[GlobalStyles.colors.primary700, GlobalStyles.colors.primary900]}
      style={styles.container}
    >
      <Animated.FlatList
        data={pages}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={
          useRef(
            ({ viewableItems }) =>
              viewableItems.length && setIndex(viewableItems[0].index)
          ).current
        }
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View key={i + Math.random().toString()} style={[styles.dot, i === index && styles.activeDot]} />
        ))}
      </View>

      {index === pages.length - 1 && (
        <Button
          mode="contained"
          onPress={() => navigation.replace("Login")}
          style={styles.button}
        >
          Continue
        </Button>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  lottie: { width: 250, height: 250, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 100,
    width: "100%",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GlobalStyles.colors.primary300,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: GlobalStyles.colors.accent500,
    width: 14,
    height: 14,
  },
});
