import { useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { resetPassword, checkEmailExists } from "../../util/http";
import AuthInput from "../../components/Authentication/AuthInput";

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Xử lý button Send Reset Link
  async function submitHandler() {
    if (!email.includes("@")) {
      Alert.alert("INVALID EMAIL", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        Alert.alert("EMAIL NOT FOUND", "This email is not registered.");
        setIsSubmitting(false);
        return;
      }

      await resetPassword(email);
      Alert.alert(
        "RESET LINK SENT",
        "Check your email to change your password !"
      );
      onBack();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Something went wrong!";
      Alert.alert("RESET FAILED", errorMessage);
    }

    setIsSubmitting(false);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your email</Text>

      <View style={styles.inputContainer}>
        <AuthInput
          label="Email Address"
          keyboardType="email-address"
          onUpdateValue={setEmail}
          value={email}
          isInvalid={false}
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
        onPress={submitHandler}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Text>
      </Pressable>
    </View>
  );
}

export default ForgotPasswordForm;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
  },

  label: {
    fontSize: 20,
    fontWeight: "600",
    color: GlobalStyles.colors.accent500,
    marginBottom: 14,
    textAlign: "center",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },

  button: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  buttonDisabled: {
    backgroundColor: GlobalStyles.colors.primary400,
  },

  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  backButton: {
    marginTop: 18,
    padding: 10,
  },

  backButtonText: {
    color: GlobalStyles.colors.accent500,
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
