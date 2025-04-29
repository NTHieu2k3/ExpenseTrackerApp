import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { useContext, useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ExpensesContex } from "../store/expenses-contex";
import { fetchExpenses } from "../util/http";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContex } from "../store/auth-contex";
import { GlobalStyles } from "../constants/styles";

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(today);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const authCtx = useContext(AuthContex);
  const expensesCtx = useContext(ExpensesContex);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses(authCtx.token, authCtx.uid);
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!, Error: ", error);
      }
      setIsFetching(false);
    }
    getExpenses();
  }, [authCtx.token, authCtx.uid]);

  if (error && !isFetching) return <ErrorOverlay message={error} />;
  if (isFetching) return <LoadingOverlay />;

  const filteredExpenses = expensesCtx.expenses.filter((expense) => {
    return expense.date >= startDate && expense.date <= endDate;
  });

  function toggleStartPicker() {
    setShowStartPicker((prev) => !prev);
    setShowEndPicker(false);
  }

  function toggleEndPicker() {
    setShowEndPicker((prev) => !prev);
    setShowStartPicker(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📆 Expenses Filter</Text>

      {/* Bộ lọc thời gian */}
      <View style={styles.filterRow}>
        <Pressable style={styles.dateButton} onPress={toggleStartPicker}>
          <Text style={styles.dateText}>
            Start: {startDate.toLocaleDateString()}
          </Text>
        </Pressable>

        <Pressable style={styles.dateButton} onPress={toggleEndPicker}>
          <Text style={styles.dateText}>
            End: {endDate.toLocaleDateString()}
          </Text>
        </Pressable>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          textColor="white"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          textColor="white"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <View style={styles.outputWrapper}>
        <ExpensesOutput
          expenses={filteredExpenses}
          expensesPeriod={`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
          fallbackText="No expenses found in the selected period."
        />
      </View>
    </View>
  );
}

export default RecentExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    textAlign: "center",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: GlobalStyles.colors.primary500,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontWeight: "bold",
  },
  outputWrapper: {
    flex: 1,
  },
});
