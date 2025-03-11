import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import AuthForm from "./AuthForm";
import ForgotPasswordForm from "../../screens/Auth/ForgotPassForm";

function AuthContent({ isLogin, onAuthenticate }) {
  const [credentialIsInvalid, setCredentialIsInvalid] = useState({
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const navigation = useNavigation();

  function switchAuthModeHandler() {
    if (isForgotPassword) {
      setIsForgotPassword(false);
      return;
    }
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    const emailsEqual = email == confirmEmail;
    const passwordsEqual = password == confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsEqual || !passwordsEqual))
    ) {
      Alert.alert("ERROR", "Please check your login information !");
      setCredentialIsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <View style={styles.authContainer}>
      <Ionicons name="wallet-outline" size={50} color={GlobalStyles.colors.accent500} />
      <Text style={styles.headerText}>Expense management</Text>
      <Text style={styles.subText}>
        {isLogin
          ? "Sign in to track your spending !"
          : "Create an account to start managing your finances !"}
      </Text>
      <View style={styles.authContent}>
        {isForgotPassword ? (
          <ForgotPasswordForm onBack={() => setIsForgotPassword(false)} />
        ) : (
          <AuthForm
            isLogin={isLogin}
            onSubmit={submitHandler}
            credentialsInvalid={credentialIsInvalid}
          />
        )}
        {isLogin && !isForgotPassword && (
          <View style={styles.forgotPassword}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.pressed,
              ]}
              onPress={() => setIsForgotPassword(true)}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.switchButton}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={switchAuthModeHandler}
          >
            <View>
              <Text style={styles.switchText}>
                {isForgotPassword
                  ? "Back to login"
                  : isLogin
                  ? "Create new account"
                  : "Sign in now"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.colors.primary900,
    flex: 1,
  },

  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlobalStyles.colors.accent500,
    marginBottom: 10,
  },

  subText: {
    fontSize: 16,
    color: GlobalStyles.colors.primary200,
    marginBottom: 26,
    textAlign: "center",
  },

  authContent: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    backgroundColor: GlobalStyles.colors.primary800,
    elevation: 5,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
  },

  switchButton: {
    paddingHorizontal: 18,
    alignSelf: "center",
    marginTop: 22,
  },

  switchText: {
    textAlign: "center",
    color: GlobalStyles.colors.accent500,
    fontSize: 17,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  forgotPassword: {
    marginTop: 14,
    alignSelf: "center",
  },

  forgotText: {
    color: GlobalStyles.colors.accent500,
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "bold"
  },

  pressed: {
    opacity: 0.7,
  },
});