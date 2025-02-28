import { useState } from "react";
import { createAccount } from "../../util/http";
import { Alert, StyleSheet } from "react-native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AuthContent from "../../components/Authentication/AuthContent";
import { useNavigation } from "@react-navigation/native";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const navigation = useNavigation();

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await createAccount(email, password);
      Alert.alert("Success", "Your account has been created successfully.", [
        { text: "OK", onPress: () => navigation.nav("Login") },
      ]);
      return;
    } catch (error) {
      Alert.alert(
        "AUTHENTICATION FAILED!",
        "Could not create account. Please check your input and try again later!"
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}

export default SignupScreen;

const styles = StyleSheet.create({});
