import { StatusBar } from "expo-status-bar";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GlobalStyles } from "./constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";

import Apploading from "expo-app-loading";
import ManageExpense from "./screens/ManageExpense";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import ChartExpenses from "./screens/ChartExpenses";
import ProfileUser from "./screens/ProfileUser";
import IconButton from "./components/UI/IconButton";
import ExpensesContexProvider from "./store/expenses-contex";
import LoginScreen from "./screens/Auth/LoginScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import AuthContexProvider, { AuthContex } from "./store/auth-contex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePassScreen from "./screens/Auth/ChangePassScreen";
import SupportScreen from "./screens/SupportScreen";
import WelcomeScreen from "./screens/WelcomScreen";
import UpdateSalary from "./screens/UpdateScreen/UpdateSalary";

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
              onPress={() => {
                navigation.navigate("ManageExpense");
              }}
            />
          ),
        headerLeft: ({ tintColor }) =>
          route.name !== "ProfileUser" && (
            <IconButton
              icon="chatbox-ellipses-outline"
              size={30}
              color={tintColor}
              onPress={() => {
                navigation.navigate("SupportScreen");
              }}
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
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
        headerTintColor: "white",
      }}
    >
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
        headerStyle: {
          backgroundColor: GlobalStyles.colors.primary500,
        },
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
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassScreen} />
      <Stack.Screen
        name="UpdateSalary"
        component={UpdateSalary}
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
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContex);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUid = await AsyncStorage.getItem("uid");
      if (storedToken && storedUid) {
        authCtx.authenticate(storedToken, storedUid);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <Apploading />;
  }
  return <Navigation />;
}

export default function App() {
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
