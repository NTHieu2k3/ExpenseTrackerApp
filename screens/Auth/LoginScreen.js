import { useContext, useState } from "react";
import { checkEmailExists, login } from "../../util/http";
import { Alert, StyleSheet } from "react-native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AuthContent from "../../components/Authentication/AuthContent";
import { AuthContex } from "../../store/auth-contex";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContex);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);

    try {
      const { token, uid } = await login(email, password);
      authCtx.authenticate(token, uid, email);
    } catch (error) {
      Alert.alert(
        "LOG IN FAILED!",
        "Could not log in. Please check your input and try again later !"
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
