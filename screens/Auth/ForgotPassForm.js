import { useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { resetPassword, checkEmailExists } from "../../util/http";
import AuthInput from "../../components/Authentication/AuthInput";

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    padding: 20,
    borderRadius: 12,
    backgroundColor: GlobalStyles.colors.primary300,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "500",
    color: GlobalStyles.colors.primary100,
    marginBottom: 12,
    textAlign: "center",
  },

  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },

  button: {
    backgroundColor: GlobalStyles.colors.primary400,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },

  buttonDisabled: {
    backgroundColor: GlobalStyles.colors.primary300,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  backButton: {
    marginTop: 16,
    padding: 8,
  },

  backButtonText: {
    color: GlobalStyles.colors.primary100,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
