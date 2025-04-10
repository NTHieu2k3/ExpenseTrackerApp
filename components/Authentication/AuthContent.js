import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

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

  //Xử lý chuyển đổi đăng nhập/đăng ký
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

  //Xử lý đăng nhập/đăng ký
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
      <IconButton
        icon="wallet-outline"
        size={70}
        color="white"
        onPress={() => {
          Alert.alert("Welcome!", "Sign in to track your spending ");
        }}
      />
      <Text style={styles.headerText}>Expenses Management</Text>
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
              <Text style={styles.forgotText}>Forgot Password ?</Text>
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
    backgroundColor: GlobalStyles.colors.primary700,
    flex: 1,
  },

  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
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

  switchButton: {
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 24,
  },

  switchText: {
    textAlign: "center",
    color: GlobalStyles.colors.primary200,
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  forgotPassword: {
    marginTop: 16,
    alignSelf: "center",
  },

  forgotText: {
    color: GlobalStyles.colors.primary200,
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },

  pressed: {
    opacity: 0.8,
  },
});
