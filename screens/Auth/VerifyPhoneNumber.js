import { useState, useContext, useEffect } from "react";
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
import { storePhoneNumber, fetchPhoneNumber } from "../../util/http";
import ErrorOverlay from "../../components/UI/ErrorOverlay";

function VerifyPhoneNumber({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // ✅ Tự động lấy số điện thoại khi mở màn hình
  useEffect(() => {
    async function loadPhoneNumber() {
      try {
        const fetchedPhone = await fetchPhoneNumber(authCtx.token, authCtx.uid);
        if (fetchedPhone) setPhoneNumber(fetchedPhone);
      } catch (error) {
        setError("Failed to load phone number. Please try again later.");
        console.log(error)
      }
    }

    loadPhoneNumber();
  }, []);

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
      setError("Failed to save phone number. Please try again later.");
      console.log(error);
    }
    setIsLoading(false);
  }

  if (error && !isLoading) {
    return <ErrorOverlay message={error} onConfirm={() => setError(null)} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>📱 Verify Phone Number</Text>
          </View>

          <Text style={styles.label}>Phone number</Text>
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
    backgroundColor: GlobalStyles.colors.primary700,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalStyles.colors.primary100,
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: GlobalStyles.colors.primary800,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});
