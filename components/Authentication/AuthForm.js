import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../../constants/styles";
import AuthInput from "./AuthInput";
import * as Animatable from "react-native-animatable";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
  }

  return (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.form}>
      <AuthInput
        label="Email Address"
        onUpdateValue={updateInputValueHandler.bind(this, "email")}
        value={enteredEmail}
        keyboardType="email-address"
        isInvalid={emailIsInvalid}
      />
      {!isLogin && (
        <AuthInput
          label="Confirm Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
          value={enteredConfirmEmail}
          keyboardType="email-address"
          isInvalid={emailsDontMatch}
        />
      )}
      <AuthInput
        label="Password"
        onUpdateValue={updateInputValueHandler.bind(this, "password")}
        value={enteredPassword}
        secure
        isInvalid={passwordIsInvalid}
      />
      {!isLogin && (
        <AuthInput
          label="Confirm Password"
          onUpdateValue={updateInputValueHandler.bind(this, "confirmPassword")}
          value={enteredConfirmPassword}
          secure
          isInvalid={passwordsDontMatch}
        />
      )}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={submitHandler}
      >
        <Text style={styles.buttonText}>{isLogin ? "Log In" : "Sign Up"}</Text>
      </Pressable>
    </Animatable.View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 10,
    paddingHorizontal: 6,
  },
  button: {
    marginTop: 22,
    borderRadius: 10,
    paddingVertical: 14,
    backgroundColor: GlobalStyles.colors.accent500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: GlobalStyles.colors.primary50,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
