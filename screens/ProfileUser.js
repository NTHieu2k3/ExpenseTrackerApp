import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import { useContext, useState } from "react";
import { AuthContex } from "../store/auth-contex";
import { useNavigation } from "@react-navigation/native";

import LoadingOverlay from "../components/UI/LoadingOverlay";

function ProfileUser() {
  const authCtx = useContext(AuthContex);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  //Xử lý button Logout
  function logoutHandler() {
    setIsLoading(true);
    setTimeout(() => {
      authCtx.logout();
      setIsLoading(false);
    }, 1500);
  }

  //Xử lý các function chưa làm
  function waitingDev() {
    Alert.alert(
      "Feature in Development",
      "We are currently working on this feature. Please check back later!",
      [{ text: "OK", style: "default" }]
    );
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={waitingDev}
      >
        <View style={styles.row}>
          <Ionicons
            name="person-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Account Information</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={waitingDev}
      >
        <View style={styles.row}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Settings</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={() => navigation.navigate("SearchExpense")}
      >
        <View style={styles.row}>
          <Ionicons
            name="search-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Search Expense</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={() => navigation.navigate("UpdateSalary")}
      >
        <View style={styles.row}>
          <Ionicons
            name="cash-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Update Salary</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Change Password</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={() => navigation.navigate("VerifyPhoneNumber")}
      >
        <View style={styles.row}>
          <Ionicons
            name="call-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Verify Phone Number</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        onPress={logoutHandler}
      >
        <View style={styles.row}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
          <Text style={styles.text}>Log Out</Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={GlobalStyles.colors.accent500}
          />
        </View>
      </Pressable>
    </View>
  );
}

export default ProfileUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 24,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: GlobalStyles.colors.primary700,
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 18,
    flex: 1,
    marginLeft: 12,
    fontWeight: "bold",
  },
});
