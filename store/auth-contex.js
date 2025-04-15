import { createContext, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContex = createContext({
  token: "",
  uid: "",
  email: "",
  isAuthenticated: false,
  authenticate: (token, uid) => {},
  logout: () => {},
});

function AuthContexProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userId, setUserId] = useState();
  const [email, setEmail] = useState(null);

  //Đăng nhập, lưu token để tự động đăng nhập lần tiếp theo và lưu uid để thực hiện các chức năng khác
  function authenticate(token, uid, email, fromStorage = false) {
    setAuthToken(token);
    setUserId(uid);
    setEmail(email);

    console.log("(authContext) email",email)

    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("uid", uid);
    AsyncStorage.setItem("email", email);
    AsyncStorage.setItem("tokenUsed", fromStorage ? "true" : "false");
  }

  function logout() {
    console.log("logoutExpense - UID:", userId);
    setAuthToken(null);
    setUserId(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("tokenUsed");
  }

  const value = {
    token: authToken,
    uid: userId,
    email: email,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContex.Provider value={value}>{children}</AuthContex.Provider>;
}

export default AuthContexProvider;
