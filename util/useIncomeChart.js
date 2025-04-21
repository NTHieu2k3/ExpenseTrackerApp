// 📁 src/util/useIncomeChart.js
import { useCallback } from "react";
import { fetchMonthlySalary, updateMonthlySalary } from "../util/http";
import { calculateBudget } from "../util/calculateBudget";
import { GlobalStyles } from "../constants/styles";

export function useIncomeChart(
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
) {
  const processYearlySalaryData = useCallback(
    (monthlyData) => {
      let totalExpenses = 0;
      let totalSavings = 0;
      let totalRemaining = 0;
      let totalBudget = 0;

      monthlyData.forEach(({ month, salaryData }) => {
        const monthExpenses = expenses.filter((expense) => {
          const date = new Date(expense.date);
          return (
            date.getFullYear() === selectedYear && date.getMonth() + 1 === month
          );
        });

        const {
          totalExpenses: e,
          totalSavings: s,
          totalRemaining: r,
          spendingBudget: b,
        } = calculateBudget(salaryData, monthExpenses, "month");

        totalExpenses += e;
        totalSavings += s;
        totalRemaining += r;
        totalBudget += b;
      });

      setTotalExpenses(totalExpenses);
      setTotalSavings(totalSavings);
      setTotalRemaining(totalRemaining);
      setSpendingBudget(totalBudget);

      const totalUsed = totalExpenses + totalSavings + totalRemaining;
      const pie = [];

      if (totalUsed > 0) {
        pie.push({
          value: Math.round((totalExpenses / totalUsed) * 100),
          color: GlobalStyles.colors.primary500,
          text: `${Math.round((totalExpenses / totalUsed) * 100)}%`,
          tooltipText: "Spending",
        });
        pie.push({
          value: Math.round((totalRemaining / totalUsed) * 100),
          color: GlobalStyles.colors.gray500,
          text: `${Math.round((totalRemaining / totalUsed) * 100)}%`,
          tooltipText: "Remaining",
        });
        pie.push({
          value: Math.round((totalSavings / totalUsed) * 100),
          color: GlobalStyles.colors.primary300,
          text: `${Math.round((totalSavings / totalUsed) * 100)}%`,
          tooltipText: "Saving",
        });
      } else {
        pie.push({
          value: 1,
          color: GlobalStyles.colors.gray500,
          text: `0%`,
          tooltipText: "No data",
        });
      }

      setPieChartData(pie);
    },
    [expenses, selectedYear]
  );

  const getIncome = useCallback(async () => {
    try {
      if (filterType === "year") {
        if (yearSalaryCache[selectedYear]) {
          processYearlySalaryData(yearSalaryCache[selectedYear]);
          return;
        }

        const salaryPromises = Array.from({ length: 12 }, (_, i) =>
          fetchMonthlySalary(authCtx.token, authCtx.uid, selectedYear, i + 1)
        );

        const monthlySalaries = await Promise.all(salaryPromises);

        let lastKnownSalary = { salary: 0, savingsGoal: 0 };

        const monthlyData = monthlySalaries.map((salaryData, index) => {
          // Fallback nếu không có dữ liệu
          if (!salaryData.salary && !salaryData.savingsGoal) {
            salaryData = lastKnownSalary;
          } else {
            lastKnownSalary = salaryData;
          }

          return {
            month: index + 1,
            salaryData,
          };
        });

        setYearSalaryCache((prev) => ({
          ...prev,
          [selectedYear]: monthlyData,
        }));

        processYearlySalaryData(monthlyData);
        return;
      }

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

      const totalUsed = totalExpenses + totalSavings + totalRemaining;
      const updatedPieChartData = [];

      if (totalUsed > 0) {
        updatedPieChartData.push({
          value: Math.round((totalExpenses / totalUsed) * 100),
          color: GlobalStyles.colors.primary500,
          text: `${Math.round((totalExpenses / totalUsed) * 100)}%`,
          tooltipText: "Spending",
        });
        updatedPieChartData.push({
          value: Math.round((totalRemaining / totalUsed) * 100),
          color: GlobalStyles.colors.gray500,
          text: `${Math.round((totalRemaining / totalUsed) * 100)}%`,
          tooltipText: "Remaining",
        });
        updatedPieChartData.push({
          value: Math.round((totalSavings / totalUsed) * 100),
          color: GlobalStyles.colors.primary300,
          text: `${Math.round((totalSavings / totalUsed) * 100)}%`,
          tooltipText: "Saving",
        });
      } else {
        updatedPieChartData.push({
          value: 1,
          color: GlobalStyles.colors.gray500,
          text: `0%`,
          tooltipText: "No data",
        });
      }

      setPieChartData(updatedPieChartData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  }, [
    authCtx,
    selectedYear,
    selectedMonth,
    filterType,
    expenses,
    filteredExpenses,
    yearSalaryCache,
    setYearSalaryCache,
    processYearlySalaryData,
    setSpendingBudget,
    setTotalExpenses,
    setTotalSavings,
    setTotalRemaining,
    setPieChartData,
  ]);

  return getIncome;
}
