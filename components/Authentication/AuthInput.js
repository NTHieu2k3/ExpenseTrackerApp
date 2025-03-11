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
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  labelInvalid: {
    color: GlobalStyles.colors.error600,
  },

  input: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary800,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: GlobalStyles.colors.primary300,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },

  inputInvalid: {
    borderColor: GlobalStyles.colors.error600,
    backgroundColor: GlobalStyles.colors.error50,
    color: GlobalStyles.colors.error800,
  },
});