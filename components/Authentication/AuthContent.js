import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import AuthForm from "./AuthForm";
import ForgotPasswordForm from "../../screens/Auth/ForgotPassForm";
import IconButton from "../UI/IconButton";

function AuthContent({ isLogin, onAuthenticate }) {
  const [credentialIsInvalid, setCredentialIsInvalid] = useState({
    email: false,
    confirmEmail: false,
    password: false,
    confirmPassword: false,
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const navigation = useNavigation();

  //Chuyển giữa SignUp/Login
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
    const emailsEqual = email === confirmEmail;
    const passwordsEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsEqual || !passwordsEqual))
    ) {
      Alert.alert("ERROR", "Please check your login information!");
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
  
  let switchLinkText = "";

  if (isForgotPassword) {
    switchLinkText = "Back to login";
  } else if (isLogin) {
    switchLinkText = "Create new account";
  } else {
    switchLinkText = "Sign in now";
  }
  return (
    <LinearGradient
      colors={[GlobalStyles.colors.primary700, GlobalStyles.colors.primary900]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <IconButton
          icon="wallet-outline"
          size={48}
          color="white"
          onPress={() =>
            Alert.alert("Welcome!", "Sign in to track your spending")
          }
        />
      </View>
      <Text style={styles.headerText}>Expenses Management</Text>
      <Text style={styles.subText}>
        {isLogin
          ? "Sign in to track your spending!"
          : "Create an account to start managing your finances!"}
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
                styles.linkButton,
                pressed && styles.pressed,
              ]}
              onPress={() => setIsForgotPassword(true)}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.switchButton}>
          <Pressable
            style={({ pressed }) => [
              styles.linkButton,
              pressed && styles.pressed,
            ]}
            onPress={switchAuthModeHandler}
          >
            <Text style={styles.linkText}>{switchLinkText}</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  logoContainer: {
    backgroundColor: GlobalStyles.colors.primary500,
    padding: 20,
    borderRadius: 100,
    marginBottom: 16,
    elevation: 5,
  },

  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
    textAlign: "center",
  },

  subText: {
    fontSize: 16,
    color: GlobalStyles.colors.primary200,
    marginBottom: 24,
    textAlign: "center",
  },

  authContent: {
    width: "100%",
    padding: 18,
    borderRadius: 16,
    backgroundColor: GlobalStyles.colors.primary700,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },

  forgotPassword: {
    marginTop: 16,
    alignSelf: "center",
  },

  switchButton: {
    marginTop: 24,
    alignSelf: "center",
  },

  linkButton: {
    paddingVertical: 4,
  },

  linkText: {
    color: GlobalStyles.colors.primary900,
    fontSize: 15,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  pressed: {
    opacity: 0.7,
  },
});
