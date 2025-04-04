import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";

function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <FontAwesome5
          name="chart-line"
          size={50}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.splashText}>
          Welcome to the expense management app !
        </Text>
        <Text style={styles.subText}>
          Track, plan and control your finances the smart way.
        </Text>
      </Animated.View>
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 24,
  },
  icon: {
    marginBottom: 20,
  },
  splashText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: GlobalStyles.colors.primary200,
    textAlign: "center",
    marginTop: 10,
  },
});
