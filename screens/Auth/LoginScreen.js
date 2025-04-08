import { useContext, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AuthContent from "../../components/Authentication/AuthContent";
import { AuthContex } from "../../store/auth-contex";
import { login } from "../../util/http";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContex);

  //Xử lý button đăng nhập từ AuthContent
  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);

    try {
      const { token, uid } = await login(email, password);
      authCtx.authenticate(token, uid, email);
    } catch (error) {
      if (error.message === "Please verify your email.") {
        Alert.alert(
          "Email Verification Needed",
          "An email was sent you for verification. Please verify your email before logging in ! "
        );
      } else {
        Alert.alert(
          "LOG IN FAILED!",
          "Could not log in. Please check your input and try again later!"
        );
      }
      console.log(error);
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
