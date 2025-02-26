import React, { useContext, useEffect, useState } from "react";
import { AuthContex } from "../store/auth-contex";
import { fetchExpenses } from "../util/http";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContex } from "../store/expenses-contex";
import IconButton from "../components/UI/IconButton";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";

function ChartExpenses({ refresh }) {
  const authCtx = useContext(AuthContex);
  const expensesCtx = useContext(ExpensesContex);
  const [expenses, setExpenses] = useState(expensesCtx.expenses);
  const [chartData, setChartData] = useState([]);
  const [filterType, setFilterType] = useState("week");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [displayTitle, setDisplayTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setExpenses(expensesCtx.expenses);
  }, [expensesCtx.expenses]);

  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses(authCtx.token, authCtx.uid);
        expensesCtx.setExpenses(expenses);

        setError(null);
      } catch (error) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    }
    getExpenses();
  }, [authCtx.token, authCtx.uid, refresh]);

  useEffect(() => {
    if (expenses.length > 0) {
      const { data, title } = processExpenses(
        expenses,
        filterType,
        selectedYear,
        selectedMonth,
        selectedWeek
      );
      if (data.length > 0) {
        setChartData(data);
      } else {
        setChartData([
          { value: 0, label: "", frontColor: GlobalStyles.colors.primary500 },
        ]);
      }

      setDisplayTitle(title);
    }
  }, [expenses, filterType, selectedYear, selectedMonth, selectedWeek]);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedYear(new Date().getFullYear());
      setSelectedMonth(new Date().getMonth() + 1);
      setSelectedWeek(0);
    }, [])
  );

  function processExpenses(expenses, type, year, month, week) {
    const currentDate = new Date();
    const dataMap = new Map();
    let title = "";

    if (type === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(
        currentDate.getDate() - currentDate.getDay() + week * 7
      );
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      title = `Week: ${startOfWeek.getDate()}/${
        startOfWeek.getMonth() + 1
      } - ${endOfWeek.getDate()}/${
        endOfWeek.getMonth() + 1
      }/${startOfWeek.getFullYear()}`;

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const key = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        dataMap.set(key, 0);
      }

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseKey = `${expenseDate.getFullYear()}-${
          expenseDate.getMonth() + 1
        }-${expenseDate.getDate()}`;
        if (dataMap.has(expenseKey)) {
          dataMap.set(expenseKey, dataMap.get(expenseKey) + expense.amount);
        }
      });
    }

    if (type === "month") {
      title = `Month: ${month}/${year}`;

      const daysInMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dataMap.set(i, 0);
      }

      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        if (date.getFullYear() === year && date.getMonth() + 1 === month) {
          dataMap.set(
            date.getDate(),
            dataMap.get(date.getDate()) + expense.amount
          );
        }
      });
    }

    if (type === "year") {
      title = `Year: ${year}`;
      for (let i = 1; i <= 12; i++) {
        dataMap.set(i, 0);
      }
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        if (date.getFullYear() === year) {
          dataMap.set(
            date.getMonth() + 1,
            dataMap.get(date.getMonth() + 1) + expense.amount
          );
        }
      });
    }
    const data = Array.from(dataMap, ([key, amount]) => ({
      value: amount,
      label: type === "week" ? key.split("-")[2] : key.toString(), // Đổi key thành chuỗi nếu là số
      frontColor: GlobalStyles.colors.primary500,
      topLabelComponent: () => (
        <Text style={styles.valueLabel}>{amount > 0 ? amount : ""}</Text>
      ),
    }));

    return { data, title }; // Trả về đúng định dạng object { data, title }
  }

  function filterExpenses(expenses) {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (filterType === "week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(
          startOfWeek.getDate() - startOfWeek.getDay() + selectedWeek * 7
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      }
      if (filterType === "month") {
        return (
          expenseDate.getFullYear() === selectedYear &&
          expenseDate.getMonth() + 1 === selectedMonth
        );
      }
      if (filterType === "year") {
        return expenseDate.getFullYear() === selectedYear;
      }
      return false;
    });
  }

  const filteredExpenses = filterExpenses(expenses);

  const [selectedFilter, setSelectedFilter] = useState("week");

  function handleFilterChange(filter) {
    setSelectedFilter(filter);
    setFilterType(filter);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Statistics</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.subtitle}>{displayTitle}</Text>

      <View style={styles.filterContainer}>
        <IconButton
          icon="calendar-outline"
          color={selectedFilter === "week" ? "yellow" : "white"}
          size={28}
          onPress={() => handleFilterChange("week")}
        />
        <IconButton
          icon="calendar-number-outline"
          color={selectedFilter === "month" ? "yellow" : "white"}
          size={28}
          onPress={() => handleFilterChange("month")}
        />
        <IconButton
          icon="calendar"
          color={selectedFilter === "year" ? "yellow" : "white"}
          size={28}
          onPress={() => handleFilterChange("year")}
        />
      </View>

      {filterType === "year" && (
        <View style={styles.selector}>
          <IconButton
            icon="chevron-back-circle-outline"
            color="white"
            size={28}
            onPress={() => setSelectedYear((prev) => prev - 1)}
          />
          <IconButton
            icon="chevron-forward-circle-outline"
            color="white"
            size={28}
            onPress={() => setSelectedYear((prev) => prev + 1)}
          />
        </View>
      )}

      {filterType === "month" && (
        <View style={styles.selector}>
          <IconButton
            icon="chevron-back-circle-outline"
            color="white"
            size={28}
            onPress={() => {
              if (selectedMonth === 1) {
                setSelectedMonth(12);
                setSelectedYear((prev) => prev - 1);
              } else {
                setSelectedMonth((prev) => prev - 1);
              }
            }}
          />
          <IconButton
            icon="chevron-forward-circle-outline"
            color="white"
            size={28}
            onPress={() => {
              if (selectedMonth === 12) {
                setSelectedMonth(1);
                setSelectedYear((prev) => prev + 1);
              } else {
                setSelectedMonth((prev) => prev + 1);
              }
            }}
          />
        </View>
      )}

      {filterType === "week" && (
        <View style={styles.selector}>
          <IconButton
            icon="chevron-back-circle-outline"
            color="white"
            size={28}
            onPress={() => setSelectedWeek((prev) => prev - 1)}
          />
          <IconButton
            icon="chevron-forward-circle-outline"
            color="white"
            size={28}
            onPress={() => setSelectedWeek((prev) => prev + 1)}
          />
        </View>
      )}

      <BarChart
        data={chartData}
        barWidth={35}
        noOfSections={5}
        yAxisThickness={0}
        xAxisThickness={2}
        isAnimated
        hideRules
        spacing={12}
        maxValue={
          chartData.length > 0
            ? Math.max(...chartData.map((item) => item.value)) * 1.2
            : 10
        }
      />
      <View style={styles.item}>
        <ExpensesOutput
          expenses={filteredExpenses}
          expensesPeriod={displayTitle}
          fallbackText="No Expenses registered for the period time !"
        />
      </View>
    </View>
  );
}

export default ChartExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  yearText: {
    fontSize: 20,
    color: "white",
    marginHorizontal: 10,
  },
  valueLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    flex: 1,
    width: "110%",
    flexGrow: 1,
  },
});
