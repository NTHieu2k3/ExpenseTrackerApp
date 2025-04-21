import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContex } from "../../store/auth-contex";
import { GlobalStyles } from "../../constants/styles";
import { changePassword } from "../../util/http";

import AsyncStorage from "@react-native-async-storage/async-storage";
import IconButton from "../../components/UI/IconButton";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import Button from "../../components/UI/Button";

function ChangePasswordScreen({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Xử lý button Change
  async function submitHandler() {
    const hasUsedToken = await AsyncStorage.getItem("tokenUsed");

    if (hasUsedToken === "true") {
      Alert.alert(
        "WARNING!",
        "Please Log out and Sign in again before Changing your password !",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => authCtx.logout(),
          },
        ]
      );
      return;
    }

    if (newPassword.length < 7) {
      Alert.alert("ERROR", "Password must be at least 6 characters !");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("ERROR", "Confirmation password does not match !");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(authCtx.token, newPassword);
      Alert.alert(
        "SUCCESSED",
        "Password changed successfully ! Please Login again to continue !",
        {
          text: "OK",
          onPress: () => authCtx.logout(),
        }
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "ERROR",
        "Unable to change password. Please try again later !"
      );
      console.log(error);
    }

    setIsLoading(false);
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Ionicons
              name="lock-closed"
              size={40}
              color={GlobalStyles.colors.primary50}
            />
            <Text style={styles.title}>CHANGE PASSWORD</Text>
            <Text style={styles.subtitle}>Please enter your new password</Text>
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholder="Enter New Password"
            />
            <IconButton
              icon={showNewPassword ? "eye-off" : "eye"}
              color="black"
              size={24}
              onPress={() => setShowNewPassword((prev) => !prev)}
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Enter Confirm Password"
            />
            <IconButton
              icon={showConfirmPassword ? "eye-off" : "eye"}
              color="black"
              size={24}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={submitHandler} style={styles.button}>
              Change
            </Button>
            <Button onPress={navigation.goBack} style={styles.button}>
              Cancel
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    paddingHorizontal: 24,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 32,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    marginTop: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: GlobalStyles.colors.primary200,
    textAlign: "center",
    marginTop: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalStyles.colors.primary100,
    marginBottom: 6,
    marginTop: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});
