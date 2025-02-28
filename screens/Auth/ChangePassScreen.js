import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContex } from "../../store/auth-contex";
import { GlobalStyles } from "../../constants/styles";
import { reauthenticateUser, changePassword } from "../../util/http";
import IconButton from "../../components/UI/IconButton";
import LoadingOverlay from "../../components/UI/LoadingOverlay";

function ChangePasswordScreen({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
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
      // Xác thực lại mật khẩu cũ
      const newIdToken = await reauthenticateUser(authCtx.email, oldPassword);
      if (!newIdToken) {
        Alert.alert("ERROR", "Incorrect old password. Please try again!");
        setIsLoading(false);
        return;
      }

      // Đổi mật khẩu sau khi xác thực thành công
      await changePassword(newIdToken, newPassword);
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
    <View style={styles.container}>
      <Text style={styles.label}>Nhập mật khẩu cũ</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOldPassword}
        />
        <IconButton
          icon={showOldPassword ? "eye-off" : "eye"}
          color="black"
          size={24}
          onPress={() => setShowOldPassword((prev) => !prev)}
        />
      </View>

      <Text style={styles.label}>Nhập mật khẩu mới</Text>
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

      <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
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

      <Pressable style={styles.button} onPress={submitHandler}>
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </Pressable>
    </View>
  );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
  button: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
