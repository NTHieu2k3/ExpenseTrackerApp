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
      Alert.alert("ERROR", "The confirmation passwords do not match !");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(authCtx.token, newPassword);
      Alert.alert("SUCCESS", "Password changed successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("ERROR", "Failed to change password. Please log in again!");
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
          <Text style={styles.label}>Enter new password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <IconButton
              icon={showNewPassword ? "eye-off" : "eye"}
              color="black"
              size={24}
              onPress={() => setShowNewPassword((prev) => !prev)}
            />
          </View>

          <Text style={styles.label}>Confirm new password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
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
    backgroundColor: GlobalStyles.colors.primary600, // Sáng hơn primary700
    paddingHorizontal: 24,
    justifyContent: "center",
    opacity: 0.98, // Làm mềm nền
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  label: {
    color: GlobalStyles.colors.primary100, // Màu sáng nhưng dịu hơn
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary50, // Dịu hơn trắng
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Tăng hiệu ứng đổ bóng
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
  button: {
    backgroundColor: GlobalStyles.colors.accent500, // Dùng accent thay vì primary500
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: GlobalStyles.colors.primary50, // Dịu hơn trắng
    fontSize: 16,
    fontWeight: "bold",
  },
});
