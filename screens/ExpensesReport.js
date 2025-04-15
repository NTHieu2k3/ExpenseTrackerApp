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
import * as MailComposer from "expo-mail-composer";
import { GlobalStyles } from "../constants/styles";
import { IconButton } from "react-native-paper";
import Button from "../components/UI/Button";
import { fetchExpenses } from "../util/http";  // Import your fetchExpenses function

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
          const expenseMonth = expense.date.getMonth() + 1;
          const expenseYear = expense.date.getFullYear();
          return expenseMonth === month && expenseYear === year;
        });

        setExpenses(filteredExpenses);
      } catch (error) {
        Alert.alert("Error", "Failed to load expenses.");
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

  async function sendExpenseReport() {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "No mail app available on this device.");
      return;
    }

    const email = authCtx?.email;
    if (!email) {
      Alert.alert("Error", "No user email found.");
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    let emailBody = `Here is your expense report for ${formattedDate}:\n\n`;

    let totalAmount = 0;
    expenses.forEach((expense) => {
      emailBody += `${expense.category}: $${expense.amount.toFixed(2)} - ${expense.description} on ${expense.date.toLocaleDateString("en-US")}\n\n`;
      totalAmount += expense.amount;
    });

    emailBody += `\nTotal Expenses: $${totalAmount.toFixed(2)}`;

    try {
      await MailComposer.composeAsync({
        recipients: [email],
        subject: `Expense Report for ${formattedDate}`,
        body: emailBody,
      });

      Alert.alert(
        "Success",
        "Check your email if you have sent report !"
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to prepare the email.");
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
              name="file-invoice-dollar"
              size={30}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.title}>Expense Report</Text>
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

          <View style={styles.buttonContainer}>
            <Button onPress={sendExpenseReport} style={styles.button}>
              Send
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
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray500,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: GlobalStyles.colors.primary500,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
