import { useState, useEffect, useContext } from "react";
import {
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  Text,
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

  //Get tất cả expenses
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

  //Hiển thị DateTimePicker
  function showDatePicker() {
    setShowPicker(true);
  }

  //Xử lý khi thay đổi ngày
  function onChange(event, date) {
    setShowPicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
    setShowPicker(false);
  }

  //Lọc các expense theo ngày
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
        expenseDate.getFullYear() === selectedDate.getFullYear() &&
        expenseDate.getMonth() === selectedDate.getMonth() &&
        expenseDate.getDate() === selectedDate.getDate() 
    );
  });

  return (
    <SafeAreaView style={styles.container}>
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

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <ExpensesOutput
          expenses={filteredExpenses}
          expensesPeriod="Total"
          fallbackText="No registered Expenses found !"
        />
      )}

      <View style={styles.buttonContainer}>
        <Button onPress={navigation.goBack} style={styles.button}>
          Return
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default SearchExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 12,
    borderRadius: 10,
    marginVertical: 30,
  },
  dateText: {
    fontSize: 16,
    color: GlobalStyles.colors.accent100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
