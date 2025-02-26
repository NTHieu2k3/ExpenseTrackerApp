import { createContext,  useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContex = createContext({
  token: "",
  uid: "",
  isAuthenticated: false,
  authenticate: (token, uid) => {},
  logout: () => {},
});

function AuthContexProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userId, setUserId] = useState();

  function authenticate(token, uid) {
    setAuthToken(token);
    setUserId(uid);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("uid", uid);
  }

  function logout() {
    console.log("logoutExpense - UID:", userId);
    setAuthToken(null);
    setUserId(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("uid");
  }

  const value = {
    token: authToken,
    uid: userId,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContex.Provider value={value}>{children}</AuthContex.Provider>;
}

export default AuthContexProvider;
