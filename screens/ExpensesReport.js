import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import { AuthContex } from "../store/auth-contex";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GlobalStyles } from "../constants/styles";
import { IconButton } from "react-native-paper";
import Button from "../components/UI/Button";
import { fetchExpenses } from "../util/http";
import { sendExpenseReportToEmail } from "../util/sendExpenseReport";

function ExpenseReport({ navigation }) {
  const authCtx = useContext(AuthContex);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadExpenses() {
      setIsLoading(true);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;

      try {
        const allExpenses = await fetchExpenses(authCtx.token, authCtx.uid);
        const filteredExpenses = allExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getFullYear() === year &&
            expenseDate.getMonth() + 1 === month
          );
        });

        setExpenses(filteredExpenses);
      } catch (error) {
        Alert.alert("Error", "Failed to load expenses - Error: ");
        console.log(error);
      }

      setIsLoading(false);
    }

    loadExpenses();
  }, [selectedDate, authCtx.token, authCtx.uid]);

  function dateChangedHandler(event, newDate) {
    if (newDate) {
      setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
    }
    setShowDatePicker(false);
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
              name="file-invoice-dollar"
              size={30}
              color={GlobalStyles.colors.accent500}
              style={styles.icon}
            />
            <View>
              <Text style={styles.title}>Expense Report</Text>
              <Text style={styles.subtitle}>
                Export report by month to your email
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Select Month & Year:</Text>
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
              color="white"
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={dateChangedHandler}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              onPress={() =>
                sendExpenseReportToEmail(
                  authCtx.email,
                  expenses,
                  `Expense Report for ${selectedDate.toLocaleDateString(
                    "en-US",
                    { month: "long", year: "numeric" }
                  )}`
                )
              }
              style={styles.button}
            >
              {isLoading ? "Sending..." : "Send Report"}
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

export default ExpenseReport;

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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: GlobalStyles.colors.primary200,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary100,
    marginBottom: 8,
    marginLeft: 4,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 6,
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: GlobalStyles.colors.primary700,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
  },
});
