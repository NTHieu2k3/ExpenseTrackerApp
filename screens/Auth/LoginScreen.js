import { Alert, Text } from "react-native";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import AuthContent from "../../components/Authentication/AuthContent";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { login } from "../../util/http";
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
        "AUTHENTICALTION FAILED !",
        "Could not log you in. Please check your credentials and try again later !"
      );
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <AuthContent isLogin onAuthenticate={loginHandler} />
      <Text></Text>
    </>
  );
}

export default LoginScreen;
