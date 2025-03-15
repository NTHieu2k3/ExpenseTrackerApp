import { StyleSheet, Text, TextInput, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function AuthInput({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize="none"
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default AuthInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 12,
  },

  label: {
    color: GlobalStyles.colors.primary50,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  labelInvalid: {
    color: GlobalStyles.colors.error500,
  },

  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: GlobalStyles.colors.primary200,
    color: GlobalStyles.colors.primary900,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: GlobalStyles.colors.primary400,
  },

  inputInvalid: {
    borderColor: GlobalStyles.colors.error500,
    backgroundColor: GlobalStyles.colors.error100,
    color: GlobalStyles.colors.error700,
  },
});