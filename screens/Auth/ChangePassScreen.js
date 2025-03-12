import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
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
import IconButton from "../../components/UI/IconButton";
import LoadingOverlay from "../../components/UI/LoadingOverlay";

function ChangePasswordScreen({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function submitHandler() {
    if (newPassword.length < 6) {
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
      Alert.alert("SUCCESSED", "Password changed successfully !");
      navigation.goBack();
    } catch (error) {
      Alert.alert("ERROR", "Unable to change password. Please try again later !");
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
            <Ionicons name="lock-closed" size={40} color={GlobalStyles.colors.primary50} />
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

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.7 },
            ]}
            onPress={submitHandler}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>
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
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    textAlign: "center",
    marginTop: 4,
  },
  label: {
    color: GlobalStyles.colors.primary100,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
  button: {
    backgroundColor: GlobalStyles.colors.accent500,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: GlobalStyles.colors.primary50,
    fontSize: 16,
    fontWeight: "bold",
  },
});
