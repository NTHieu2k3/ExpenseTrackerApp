import { useState } from "react";
import { checkEmailExists, createAccount } from "../../util/http";
import { Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AuthContent from "../../components/Authentication/AuthContent";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const navigation = useNavigation();

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert("EMAIL EXISTS", "This email is already registered.");
        setIsAuthenticating(false);
        return;
      }

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
