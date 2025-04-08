import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { AuthContex } from "../../store/auth-contex";
import Button from "../../components/UI/Button";
import { GlobalStyles } from "../../constants/styles";
import { storePhoneNumber } from "../../util/http";

function VerifyPhoneNumber({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý button Save để lưu SĐT vào db
  async function handleVerify() {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number.");
      return;
    }

    setIsLoading(true);
    try {
      await storePhoneNumber(authCtx.token, phoneNumber, authCtx.uid);
      Alert.alert("Success", "Phone number saved successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save phone number.");
    }
    setIsLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify Phone Number</Text>
          </View>

          <Text style={styles.label}>Enter your phone number:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            placeholderTextColor={GlobalStyles.colors.gray500}
            keyboardType="phone-pad"
          />

          <View style={styles.buttonContainer}>
            <Button onPress={handleVerify} style={styles.button}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button onPress={navigation.goBack} style={styles.button}>
              Cancel
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default VerifyPhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: "100%",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
