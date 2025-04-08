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
  updateExpense: (id, { description, amount, date, category }) => {},
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
  async function validateAndAddExpense(expenseData, isUpdate = false) {
    const { id, date, amount, category } = expenseData;
    if (!id || !date || !amount || !category) {
      return;
    }
    const expenseDate = new Date(date);
    const selectedYear = expenseDate.getFullYear();
    const selectedMonth = expenseDate.getMonth() + 1;
    const selectedWeek = getSelectedWeek(expenseDate);

    const filterType = "month";

    const salaryData = await fetchSalaryData(selectedYear, selectedMonth);
    let updatedExpenses = [...expensesState];

    if (isUpdate) {
      updatedExpenses = updatedExpenses.filter((e) => e.id !== id);
    }

    const filteredExpensesBefore = filterExpenses(
      updatedExpenses,
      filterType,
      selectedYear,
      selectedMonth,
      selectedWeek
    );

    const { totalRemaining: totalRemainingBefore } = calculateBudget(
      salaryData,
      filteredExpensesBefore,
      filterType
    );

    if (
      parseFloat(amount.toFixed(2)) >
      parseFloat(totalRemainingBefore.toFixed(2))
    ) {
      Alert.alert(
        "Warning",
        "The amount spent exceeds the remaining amount ! Do you want to continue ?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              if (isUpdate) {
                const existingExpense = expensesState.find((e) => e.id === id);
                if (!existingExpense) {
                  console.log("Không tìm thấy expense cần cập nhật!");
                  return;
                }
                dispatch({
                  type: "UPDATE",
                  payload: { id, data: expenseData },
                });
              } else {
                dispatch({ type: "ADD", payload: expenseData });
              }
            },
          },
        ]
      );
    } else {
      if (isUpdate) {
        const existingExpense = expensesState.find((e) => e.id === id);
        if (!existingExpense) {
          console.log("Không tìm thấy expense cần cập nhật!");
          return;
        }
        dispatch({
          type: "UPDATE",
          payload: { id, data: expenseData },
        });
      } else {
        dispatch({ type: "ADD", payload: expenseData });
      }
    }
    console.log("DEBUG - Lương: ", salaryData);
    console.log("DEBUG - Chi tiêu: ", amount);
    console.log("DEBUG - totalRemaining: ", totalRemaining);
  }

  function addExpense(expenseData) {
    validateAndAddExpense(expenseData, false);
  }

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    validateAndAddExpense({ ...expenseData, id }, true);
  }

  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContex.Provider value={value}>{children}</ExpensesContex.Provider>
  );
}

export default ExpensesContexProvider;
