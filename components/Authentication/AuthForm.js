import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { GlobalStyles } from "../../constants/styles";

import AuthInput from "./AuthInput";

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
      default:
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
    <View style={styles.form}>
      <View>
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
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            value={enteredConfirmPassword}
            secure
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={submitHandler}
          >
            <View>
              <Text style={styles.buttonText}>
                {isLogin ? "Log In" : "Sign Up"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  form: {
    marginVertical: 30,
    marginHorizontal: 16,
    padding: 24,
  },

  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.colors.primary500,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },

  buttons: {
    marginTop: 24,
  },

  pressed: {
    opacity: 0.8,
  },

  buttonText: {
    textAlign: "center",
    color: GlobalStyles.colors.primary50,
    fontSize: 18,
    fontWeight: "bold",
  },

  input: {
    flex: 1,
  },
});
