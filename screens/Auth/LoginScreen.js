import { useState } from "react";
import { checkEmailExists, login } from "../../util/http";
import { Alert, StyleSheet } from "react-native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AuthContent from "../../components/Authentication/AuthContent";
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigation = useNavigation();

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert("Email Not Found", "This email is not registered.");
        setIsAuthenticating(false);
        return;
      }

      await login(email, password);
      Alert.alert("Success", "You have logged in successfully.");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(
        "AUTHENTICATION FAILED!",
        "Could not log in. Please check your credentials and try again!"
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }

  return <AuthContent isLogin={true} onAuthenticate={loginHandler} />;
}

export default LoginScreen;

const styles = StyleSheet.create({});
