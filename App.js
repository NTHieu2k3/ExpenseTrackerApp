import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlobalStyles } from "./constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import ManageExpense from "./screens/ManageExpense";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import ChartExpenses from "./screens/ChartExpenses";
import ProfileUser from "./screens/ProfileUser";
import LoginScreen from "./screens/Auth/LoginScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import ChangePassScreen from "./screens/Auth/ChangePassScreen";
import SupportScreen from "./screens/SupportScreen";
import WelcomeScreen from "./screens/WelcomScreen";
import UpdateSalary from "./screens/UpdateScreen/UpdateSalary";
import SearchExpense from "./screens/SearchExpense";
import VerifyPhoneNumber from "./screens/Auth/VerifyPhoneNumber";
import ExpenseReport from "./screens/ExpensesReport";
import SplashScreenn from "./screens/SplashScreen";

// Context & UI
import IconButton from "./components/UI/IconButton";
import ExpensesContexProvider from "./store/expenses-contex";
import AuthContexProvider, { AuthContex } from "./store/auth-contex";
import InfoScreen from "./screens/InfoScreen";

// ✅ Setup splash control
SplashScreen.preventAutoHideAsync();

// ✅ Setup Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  const navigation = useNavigation();

  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) =>
          route.name !== "ProfileUser" && (
            <IconButton
              icon="add"
              size={30}
              color={tintColor}
              onPress={() => navigation.navigate("ManageExpense")}
            />
          ),
        headerLeft: ({ tintColor }) =>
          route.name !== "ProfileUser" && (
            <IconButton
              icon="chatbox-ellipses-outline"
              size={30}
              color={tintColor}
              onPress={() => navigation.navigate("SupportScreen")}
            />
          ),
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <BottomTabs.Screen
        name="ChartExpenses"
        component={ChartExpenses}
        options={{
          title: "Chart Expenses",
          tabBarLabel: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <BottomTabs.Screen
        name="ProfileUser"
        component={ProfileUser}
        options={{
          title: "Profile",
          tabBarLabel: "Me",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreenn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpensesOverview"
        component={ExpensesOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{ presentation: "modal", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateSalary"
        component={UpdateSalary}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExpensesReport"
        component={ExpenseReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchExpense"
        component={SearchExpense}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyPhoneNumber"
        component={VerifyPhoneNumber}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportScreen"
        component={SupportScreen}
        options={{ presentation: "modal", title: "Personal Assistant" }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContex);
  return (
    <NavigationContainer ref={navigationRef}>
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContex);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  useEffect(() => {
    async function fetchToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUid = await AsyncStorage.getItem("uid");
        const storedEmail = await AsyncStorage.getItem("email");

        if (storedToken && storedUid && storedEmail) {
          authCtx.authenticate(storedToken, storedUid, storedEmail, true);
        }
      } catch (err) {
        console.error("Error restoring auth from storage:", err);
      } finally {
        setIsTryingLogin(false);
      }
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}

export default function App() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const expenseId = response.notification.request.content.data?.id;
        if (expenseId && navigationRef.isReady()) {
          navigationRef.navigate("ManageExpense", { expenseId });
        }
      }
    );

    return () => subscription.remove();
  }, []);
  return (
    <>
      <StatusBar style="light" />
      <AuthContexProvider>
        <ExpensesContexProvider>
          <Root />
        </ExpensesContexProvider>
      </AuthContexProvider>
    </>
  );
}
