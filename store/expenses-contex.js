import { createContext, useContext, useReducer } from "react";
import { fetchMonthlySalary } from "../util/http";
import { AuthContex } from "./auth-contex";
import { filterExpenses } from "../util/filterExpenses";
import { calculateBudget } from "../util/calculateBudget";
import { Alert } from "react-native";

//Tạo ctx để share dữ liệu giữa các component
export const ExpensesContex = createContext({
  expenses: [],
  addExpense: ({ description, amount, date, category }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  update: (id, { description, amount, date, category }) => {},
});

//Xử lý các hành động với danh sách chi tiêu
function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state].sort((a, b) => b.date - a.date);
    case "SET":
      return action.payload.sort((a, b) => b.date - a.date);
    case "UPDATE":
      return state
        .map((expense) =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload.data }
            : expense
        )
        .sort((a, b) => b.date - a.date);
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContexProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);
  const authCtx = useContext(AuthContex);

  //Lấy dữ liệu lương theo tháng và năm
  async function fetchSalaryData(selectedYear, selectedMonth) {
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

      return salaryData;
    } catch (error) {
      console.error("Lỗi tải dữ liệu lương:", error);
      return { salary: 0, savingsGoal: 0 };
    }
  }

  function getSelectedWeek(expenseDate) {
    return expenseDate;
  }

  //Kiểm tra và thông báo cho người dùng khi Add/Update có bị vượt qua ngân sách chi tiêu còn lại hay không
  async function validateAndAddExpense(
    expenseData,
    onSuccess,
    isUpdate = false,
    customExpensesList = null
  ) {
    const { id, date, amount, category } = expenseData;
    if (!id || !date || !amount || !category) return;

    const expenseDate = new Date(date);
    expenseDate.setHours(0, 0, 0, 0); // 💡 reset giờ

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const proceed = async () => {
      const selectedYear = expenseDate.getFullYear();
      const selectedMonth = expenseDate.getMonth() + 1;
      const selectedWeek = getSelectedWeek(expenseDate);
      const filterType = "month";

      const salaryData = await fetchSalaryData(selectedYear, selectedMonth);

      let updatedExpenses = customExpensesList
        ? [...customExpensesList]
        : [...expensesState];
      if (isUpdate) {
        updatedExpenses = updatedExpenses.filter((e) => e.id !== id);
      }

      const filteredExpenses = filterExpenses(
        updatedExpenses,
        filterType,
        selectedYear,
        selectedMonth,
        selectedWeek
      );

      const { totalRemaining } = calculateBudget(
        salaryData,
        filteredExpenses,
        filterType
      );

      const dispatchData = () => {
        const cleanedExpenseData = { ...expenseData };
        delete cleanedExpenseData.overridden;

        dispatch({
          type: isUpdate ? "UPDATE" : "ADD",
          payload: isUpdate
            ? { id, data: cleanedExpenseData }
            : cleanedExpenseData,
        });
        if (onSuccess) onSuccess();
      };

      const dispatchDataWithOverride = () => {
        const dataWithFlag = { ...expenseData, overridden: true };
        dispatch({
          type: isUpdate ? "UPDATE" : "ADD",
          payload: isUpdate ? { id, data: dataWithFlag } : dataWithFlag,
        });
        if (onSuccess) onSuccess();
      };

      if (amount > totalRemaining) {
        Alert.alert(
          "Over Budget",
          "This expense exceeds your remaining budget. Do you want to continue?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Add anyway",
              onPress: () => {
                dispatchDataWithOverride(); // chỉ override khi người dùng xác nhận
              },
            },
          ]
        );
      } else {
        dispatchData(); // không override nếu không vượt
      }
    };
    if (expenseDate > today) {
      Alert.alert(
        "Future Date",
        "The selected date is in the future. Do you still want to add this expense?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add Anyway", onPress: proceed },
        ]
      );
    } else {
      await proceed();
    }
  }

  function addExpense(expenseData, onSuccess, customList) {
    validateAndAddExpense(expenseData, onSuccess, false, customList);
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function update(id, expenseData, onSuccess, customList) {
    validateAndAddExpense({ ...expenseData, id }, onSuccess, true, customList);
  }

  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    update: update,
  };

  return (
    <ExpensesContex.Provider value={value}>{children}</ExpensesContex.Provider>
  );
}

export default ExpensesContexProvider;
