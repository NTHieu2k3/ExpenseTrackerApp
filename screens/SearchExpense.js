import { useState, useEffect, useContext } from "react";
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
} from "react-native";
import { GlobalStyles } from "../constants/styles";
import { fetchExpenses } from "../util/http";
import { AuthContex } from "../store/auth-contex";
import { useNavigation } from "@react-navigation/native";

import DateTimePicker from "@react-native-community/datetimepicker";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import Button from "../components/UI/Button";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import IconButton from "../components/UI/IconButton";

function SearchExpense() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContex);
  const { token, uid } = authCtx;
  const navigation = useNavigation();

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true);
      try {
        const fetchedExpenses = await fetchExpenses(token, uid);
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
      setIsLoading(false);
    }
    getExpenses();
  }, [token, uid]);

  function showDatePicker() {
    setShowPicker(true);
  }

  function onChange(event, date) {
    setShowPicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
    setShowPicker(false);
  }

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === selectedDate.getFullYear() &&
      expenseDate.getMonth() === selectedDate.getMonth() &&
      expenseDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🔍 Search Expenses by Date</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Selected Date</Text>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Text>
            <IconButton
              icon="calendar"
              size={24}
              color={GlobalStyles.colors.accent500}
              onPress={showDatePicker}
            />
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            textColor="white"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onChange}
          />
        )}

        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <View style={styles.results}>
            <ExpensesOutput
              expenses={filteredExpenses}
              expensesPeriod="Results"
              fallbackText="No expenses found for this day!"
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={navigation.goBack}>← Return</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SearchExpense;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: GlobalStyles.colors.primary600,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  results: {
    marginBottom: 32,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
