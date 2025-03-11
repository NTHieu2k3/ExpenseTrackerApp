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
import { fetchMonthlySalary, updateMonthlySalary } from "../../util/http";
import { GlobalStyles } from "../../constants/styles";

import DateTimePicker from "@react-native-community/datetimepicker";
import IconButton from "../../components/UI/IconButton";
import Button from "../../components/UI/Button";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

function UpdateSalary({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [salary, setSalary] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    async function loadSalary() {
      try {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const data = await fetchMonthlySalary(
          authCtx.token,
          authCtx.uid,
          year,
          month
        );

        setSalaryData(data);
        setSalary(data.salary.toString());
        setSavingsGoal(data.savingsGoal.toString());
      } catch (error) {
        Alert.alert("Error", "Failed to load salary data.");
      }
    }
    loadSalary();
  }, [selectedDate]);

  function dateChangedHandler(event, newDate) {
    if (newDate) {
      setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
    setShowDatePicker(false);
  }

  async function handleUpdate() {
    if (!salary.trim()) {
      Alert.alert("Error", "Please enter your salary.");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const newSalary = parseFloat(salary);
    const newSavingsGoal = savingsGoal ? parseFloat(savingsGoal) : 0;

    try {
      await updateMonthlySalary(
        authCtx.token,
        newSalary,
        newSavingsGoal,
        authCtx.uid,
        year,
        month
      );

      Alert.alert("Success", "Salary updated successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update salary.");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome5
              name="wallet"
              size={30}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.title}>Update Salary & Savings</Text>
          </View>
          <Text style={styles.label}>Select month / year:</Text>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </Text>
            <IconButton
              icon="calendar"
              color={GlobalStyles.colors.primary500}
              size={24}
              onPress={() => setShowDatePicker(true)}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={dateChangedHandler}
              textColor="white"
              fontSize="16"
            />
          )}

          <Text style={styles.label}>Enter new salary:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={salary}
              onChangeText={setSalary}
              placeholder="Enter amount..."
              placeholderTextColor={GlobalStyles.colors.gray500}
            />
          </View>

          <Text style={styles.label}>Enter savings goal:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={savingsGoal}
              onChangeText={setSavingsGoal}
              placeholder="Enter amount..."
              placeholderTextColor={GlobalStyles.colors.gray500}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={handleUpdate} style={styles.button}>
              Update
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

export default UpdateSalary;

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  icon: {
    marginRight: 10,
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
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray500,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: "100%",
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
    marginRight: 8,
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
  input: {
    flex: 1,
    fontSize: 16,
    textAlign:'center'
  },
});
