import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContex } from "../store/auth-contex";
import { fetchExpenses, fetchMonthlySalary } from "../util/http";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContex } from "../store/expenses-contex";
import { useFocusEffect } from "@react-navigation/native";
import { filterExpenses } from "../util/filterExpenses";
import { calculateBudget } from "../util/calculateBudget";

import IconButton from "../components/UI/IconButton";
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
  const [spendingBudget, setSpendingBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);

  const [pieChartData, setPieChartData] = useState([
    { value: 0, color: GlobalStyles.colors.primary500, text: "Spending" },
    { value: 0, color: GlobalStyles.colors.gray500, text: "Remaining" },
    { value: 0, color: GlobalStyles.colors.gray500, text: "Saving" },
  ]);

  const filteredExpenses = useMemo(
    () =>
      filterExpenses(
        expenses,
        filterType,
        selectedYear,
        selectedMonth,
        selectedWeek
      ),
    [expenses, filterType, selectedYear, selectedMonth, selectedWeek]
  );

  useEffect(() => {
    async function getIncome() {
      try {
        let salaryData = await fetchMonthlySalary(
          authCtx.token,
          authCtx.uid,
          selectedYear,
          selectedMonth
        );

        if (!salaryData.salary && !salaryData.savingsGoal) {
          for (let m = selectedMonth - 1; m > 0; m--) {
            salaryData = await fetchMonthlySalary(
              authCtx.token,
              authCtx.uid,
              selectedYear,
              m
            );
            if (salaryData.salary || salaryData.savingsGoal) break;
          }

          if (salaryData.salary || salaryData.savingsGoal) {
            await updateMonthlySalary(
              authCtx.token,
              salaryData.salary || 0,
              salaryData.savingsGoal || 0,
              authCtx.uid,
              selectedYear,
              selectedMonth
            );
          }
        }

        const { totalExpenses, totalSavings, totalRemaining, spendingBudget } =
          calculateBudget(salaryData, filteredExpenses, filterType);

        setSpendingBudget(spendingBudget);
        setTotalExpenses(totalExpenses);
        setTotalSavings(totalSavings);
        setTotalRemaining(totalRemaining);

        let totalUsed = totalExpenses + totalSavings + totalRemaining;
        let expensesPercentage = Math.round((totalExpenses / totalUsed) * 100);
        let savingsPercentage = Math.round((totalSavings / totalUsed) * 100);
        let remainingPercentage = Math.round(
          (totalRemaining / totalUsed) * 100
        );

        const updatedPieChartData = [];

        if (expensesPercentage > 0) {
          updatedPieChartData.push({
            value: expensesPercentage,
            color: GlobalStyles.colors.primary500,
            text: `${expensesPercentage}%`,
            tooltipText: "Spending",
          });
        }

        if (remainingPercentage > 0) {
          updatedPieChartData.push({
            value: remainingPercentage,
            color: GlobalStyles.colors.gray500,
            text: `${remainingPercentage}%`,
            tooltipText: "Remaining",
          });
        }

        if (savingsPercentage > 0) {
          updatedPieChartData.push({
            value: savingsPercentage,
            color: GlobalStyles.colors.primary300,
            text: `${savingsPercentage}%`,
            tooltipText: "Saving",
          });
        }

        setPieChartData(updatedPieChartData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    }

    getIncome();
  }, [expenses, selectedMonth, selectedYear, filterType, filteredExpenses]);

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
        setError("Can not load data. Please try again later !");
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
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);

      startOfWeek.setDate(
        currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + week * 7
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
      label: type === "week" ? key.split("-")[2] : key.toString(),
      frontColor: GlobalStyles.colors.primary500,
      topLabelComponent: () => (
        <Text style={styles.valueLabel}>{amount > 0 ? amount : ""}</Text>
      ),
    }));

    return { data, title };
  }

  const [selectedFilter, setSelectedFilter] = useState("week");

  function handleFilterChange(filter) {
    setSelectedFilter(filter);
    setFilterType(filter);
  }

  const getTimePeriodLabel = (filterType) => {
    switch (filterType) {
      case "week":
        return "week";
      case "year":
        return "year";
      default:
        return "month";
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary700 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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

            <IconButton
              icon="document-outline"
              color={"white"}
              size={28}
              onPress={() => {
                Alert.alert(
                  "PDF Report not yet complete",
                  "We are developing this feature. Please try again later!",
                  [{ text: "OK", style: "default" }]
                );
              }}
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
            yAxisThickness={2}
            xAxisThickness={2}
            isAnimated
            hideRules
            spacing={12}
            maxValue={
              chartData.length > 0
                ? Math.max(...chartData.map((item) => item.value)) * 1.2
                : 10
            }
            yAxisTextStyle={{ color: "white" }}
            xAxisLabelTextStyle={{ color: "white", fontSize: 14 }}
            barStyle={{ backgroundColor: "white" }}
          />

          <View style={styles.piechart}>
            <Text style={styles.subtitle}>
              Your planned expenses for this {getTimePeriodLabel(filterType)} $
              {spendingBudget.toLocaleString()}
            </Text>
            <PieChart
              data={pieChartData}
              donut
              showValuesAsLabels
              radius={100}
              showText
              textSize={14}
              textColor="white"
              innerRadius={false}
              showTooltip={true}
            />
            <View style={{ marginTop: 10 }}>
              <Text style={styles.percentageText}>
                Spending: ${totalExpenses.toLocaleString()}
              </Text>
              <Text style={styles.percentageText}>
                Saving: ${totalSavings.toLocaleString()}
              </Text>
              <Text style={styles.percentageText}>
                Remaining: ${totalRemaining.toLocaleString()}
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Detail</Text>
          <View style={styles.item}>
            <ExpensesOutput
              expenses={filteredExpenses}
              expensesPeriod={displayTitle}
              fallbackText="No Expenses registered for the period time !"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChartExpenses;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary700,
    padding: 32,
    alignItems: "center",
    flex: 1,
  },
  piechart: {
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "white",
    borderTopColor: "white",
    marginVertical: 10,
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
    marginTop: 20,
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
  incomeText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 10,
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
  percentageText: {
    fontSize: 16,
    color: "white",
    marginVertical: 2,
  },
  space: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: "white",
    borderTopColor: "white",
    marginVertical: 10,
  },
});
