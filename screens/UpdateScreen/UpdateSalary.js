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
          <Text style={styles.title}>
            LET CHANGE YOUR SALARY AND SAVINGS GOAL
          </Text>
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
            />
          )}

          <Text style={styles.label}>Enter new salary:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
            placeholder="Nhập số tiền..."
            placeholderTextColor={GlobalStyles.colors.gray500}
          />

          <Text style={styles.label}>Enter savings goal:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={savingsGoal}
            onChangeText={setSavingsGoal}
            placeholder="Nhập số tiền..."
            placeholderTextColor={GlobalStyles.colors.gray500}
          />

          <View style={styles.buttonContainer}>
            <Button onPress={handleUpdate} style={styles.button}>
              Cập nhật
            </Button>
            <Button onPress={navigation.goBack} style={styles.button}>
              Hủy
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 1.5,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
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
  dateText: {
    fontSize: 16,
    color: GlobalStyles.colors.primary700,
  },
  input: {
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray500,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: GlobalStyles.colors.gray700,
    marginBottom: 16,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
