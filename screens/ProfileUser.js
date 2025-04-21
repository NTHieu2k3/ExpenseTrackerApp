import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
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

  function logoutHandler() {
    setIsLoading(true);
    setTimeout(() => {
      authCtx.logout();
      setIsLoading(false);
    }, 1500);
  }

  function waitingDev() {
    Alert.alert(
      "Feature in Development",
      "We are currently working on this feature. Please check back later!",
      [{ text: "OK", style: "default" }]
    );
  }

  if (isLoading) return <LoadingOverlay />;

  const items = [
    {
      label: "Account Information",
      icon: "person-outline",
      action: waitingDev,
    },
    {
      label: "Settings",
      icon: "settings-outline",
      action: waitingDev,
    },
    {
      label: "Search Expense",
      icon: "search-outline",
      action: () => navigation.navigate("SearchExpense"),
    },
    {
      label: "Update Salary",
      icon: "cash-outline",
      action: () => navigation.navigate("UpdateSalary"),
    },
    {
      label: "Change Password",
      icon: "lock-closed-outline",
      action: () => navigation.navigate("ChangePassword"),
    },
    {
      label: "Verify Phone Number",
      icon: "call-outline",
      action: () => navigation.navigate("VerifyPhoneNumber"),
    },
    {
      label: "Expense Report",
      icon: "document-text-outline",
      action: () => navigation.navigate("ExpensesReport"),
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary700 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name="person-circle-outline"
              size={80}
              color={GlobalStyles.colors.accent500}
            />
            <Text style={styles.greeting}>
              Hello, {authCtx.email || "User"}
            </Text>
          </View>

          {items.map((item, index) => (
            <Pressable
              key={index + Math.random().toString()}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              onPress={item.action}
            >
              <View style={styles.row}>
                <Ionicons name={item.icon} size={24} color="white" />
                <Text style={styles.text}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color={GlobalStyles.colors.accent500}
                />
              </View>
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.item,
              styles.logoutItem,
              pressed && styles.pressed,
            ]}
            onPress={logoutHandler}
          >
            <View style={styles.row}>
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.text}>Log Out</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={GlobalStyles.colors.accent500}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ProfileUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    padding: 24,
    paddingBottom: 40,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  greeting: {
    marginTop: 8,
    fontSize: 18,
    color: GlobalStyles.colors.primary50,
    fontWeight: "600",
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.colors.primary600,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  logoutItem: {
    backgroundColor: GlobalStyles.colors.error500,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    color: "white",
    marginLeft: 16,
  },
});
