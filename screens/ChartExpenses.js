import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContex } from "../store/auth-contex";
import { fetchExpenses } from "../util/http";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContex } from "../store/expenses-contex";
import { useFocusEffect } from "@react-navigation/native";
import { filterExpenses } from "../util/filterExpenses";
import { processExpenses } from "../util/processExpenses";
import { useIncomeChart } from "../util/useIncomeChart";
import { sendExpenseReportToEmail } from "../util/sendExpenseReport";

import FilterButtons from "../components/Chart/FilterButtons";
import SelectorControls from "../components/Chart/SelectorControls";
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
  const [yearSalaryCache, setYearSalaryCache] = useState({});
  const [pieChartData, setPieChartData] = useState([
    { value: 0, color: GlobalStyles.colors.primary500, text: "Spending" },
    { value: 0, color: GlobalStyles.colors.gray500, text: "Remaining" },
    { value: 0, color: GlobalStyles.colors.gray500, text: "Saving" },
  ]);

  //Lọc chi tiêu theo thời gian
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

  //Lấy dữ liệu lương và tính toán ngân sách cho piechart
  const getIncome = useIncomeChart(
    authCtx,
    selectedYear,
    selectedMonth,
    filterType,
    expenses,
    filteredExpenses,
    yearSalaryCache,
    setYearSalaryCache,
    setTotalExpenses,
    setTotalSavings,
    setTotalRemaining,
    setSpendingBudget,
    setPieChartData
  );

  useEffect(() => {
    getIncome();
  }, [
    getIncome,
    selectedYear,
    selectedMonth,
    filterType,
    expenses,
    filteredExpenses,
  ]);

  //Cập nhật chi tiêu khi context thay đổi
  useEffect(() => {
    setExpenses(expensesCtx.expenses);
  }, [expensesCtx.expenses]);

  //Lấy dữ liệu chi tiêu từ server
  useEffect(() => {
    async function getExpenses() {
      try {
        const expenses = await fetchExpenses(authCtx.token, authCtx.uid);
        expensesCtx.setExpenses(expenses);

        setError(null);
      } catch (error) {
        setError("Can not load data. Please try again later !");
        console.log(error);
      }
    }
    getExpenses();
  }, [authCtx.token, authCtx.uid, refresh]);

  //Xử lý dữ liệu để hiển thị BarChart
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

  //Reset bộ lọc khi focus lại màn hình
  useFocusEffect(
    React.useCallback(() => {
      setSelectedYear(new Date().getFullYear());
      setSelectedMonth(new Date().getMonth() + 1);
      setSelectedWeek(0);
    }, [])
  );

  //Hàm xử lý biểu đồ theo thời gian

  //Hàm xử lý chọn bộ lọc
  const [selectedFilter, setSelectedFilter] = useState("week");

  //Xử lý thay đổi thời gian
  function handleFilterChange(filter) {
    setSelectedFilter(filter);
    setFilterType(filter);
  }

  //Xử lý hiển thị label
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
          <Text style={styles.title}>📊Expense Statistics</Text>
          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.subtitle}>{displayTitle}</Text>

          <View style={styles.filterContainer}>
            <FilterButtons
              selectedFilter={selectedFilter}
              onChange={handleFilterChange}
            />
            <IconButton
              icon="document-outline"
              color={"white"}
              size={28}
              onPress={() => {
                sendExpenseReportToEmail(
                  authCtx.email,
                  filteredExpenses,
                  displayTitle
                );
              }}
            />
          </View>

          {(filterType === "year" ||
            filterType === "month" ||
            filterType === "week") && (
            <View style={styles.selector}>
              <SelectorControls
                filterType={filterType}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
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
            spacing={16}
            maxValue={
              chartData.length > 0
                ? Math.max(...chartData.map((item) => item.value)) * 1.2
                : 10
            }
            yAxisTextStyle={{ color: "white" }}
            xAxisLabelTextStyle={{ color: "white", fontSize: 14 }}
            barStyle={{ backgroundColor: "white" }}
            rulesColor={GlobalStyles.colors.primary500}
          />

          <View style={styles.piechart}>
            <Text style={styles.subtitle}>
              Your planned expenses for this {getTimePeriodLabel(filterType)} $
              {spendingBudget.toLocaleString()}
            </Text>
            <PieChart
              data={pieChartData}
              donut
              innerRadius={false}
              x
              showTooltip={true}
              showValuesAsLabels
              textSize={14}
              showText
              textColor="white"
              strokeWidth={1}
              strokeColor={GlobalStyles.colors.primary700}
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
          <Text style={styles.subtitle}>💼 Details</Text>
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
    padding: 25,
    alignItems: "center",
    flex: 1,
  },

  piechart: {
    backgroundColor: GlobalStyles.colors.primary600,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    marginTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: GlobalStyles.colors.primary100,
    textAlign: "center",
    marginBottom: 16,
    marginTop: 12,
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
