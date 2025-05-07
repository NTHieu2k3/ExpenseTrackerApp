import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { resetPassword, checkEmailExists } from "../../util/http";
import AuthInput from "../../components/Authentication/AuthInput";
import { Ionicons } from "@expo/vector-icons";

function ForgotPasswordForm({ onBack }) {
  const [mode, setMode] = useState("email"); // "email" | "phone"
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputIsInvalid, setInputIsInvalid] = useState(false);

  const isEmailMode = mode === "email";

  function switchMode() {
    setMode((prev) => (prev === "email" ? "phone" : "email"));
    setInputValue("");
    setInputIsInvalid(false);
  }

  async function submitHandler() {
    if (isEmailMode) {
      if (!inputValue.includes("@")) {
        setInputIsInvalid(true);
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }

      setIsSubmitting(true);
      try {
        const exists = await checkEmailExists(inputValue);
        if (!exists) {
          Alert.alert(
            "Email Not Found",
            "We couldn’t find an account with that email address."
          );
          setIsSubmitting(false);
          return;
        }

        await resetPassword(inputValue);
        Alert.alert(
          "Success",
          "We've sent you a password reset email. Please check your email."
        );
        onBack();
      } catch (error) {
        const msg =
          error.response?.data?.error?.message || "Something went wrong.";
        Alert.alert("Error", msg);
      }
      setIsSubmitting(false);
    } else {
      Alert.alert(
        "Coming Soon",
        "Password reset by phone number is currently under development."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={styles.card}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>🔐 Reset Your Password</Text>

          <Text style={styles.subtitle}>
            {isEmailMode
              ? "Enter your email address and we'll send you a link to reset your password."
              : "Phone number reset is not available at the moment."}
          </Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isEmailMode
                ? "Want to use your phone instead ?"
                : "Want to use your email instead ?"}
            </Text>
            <Pressable onPress={switchMode}>
              <Text style={styles.switchLink}>
                {isEmailMode ? "Reset by Phone" : "Reset by Email"}
              </Text>
            </Pressable>
          </View>

          <AuthInput
            label={isEmailMode ? "Email Address" : "Phone Number"}
            keyboardType={isEmailMode ? "email-address" : "phone-pad"}
            value={inputValue}
            onUpdateValue={setInputValue}
            isInvalid={inputIsInvalid}
          />

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={submitHandler}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="send-outline"
                  size={20}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.submitText}>
                  {isEmailMode ? "Send Reset Email" : "Coming Soon"}
                </Text>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default ForgotPasswordForm;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: GlobalStyles.colors.primary50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: GlobalStyles.colors.primary200,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  switchText: {
    color: GlobalStyles.colors.primary100,
    marginRight: 4,
    fontSize: 14,
  },
  switchLink: {
    color: GlobalStyles.colors.accent500,
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: GlobalStyles.colors.accent500,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
