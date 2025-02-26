import { StyleSheet } from "react-native";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext } from "react";
import { ExpensesContex } from "../store/expenses-contex";

function AllExpenses() {
  const expensesCtx = useContext(ExpensesContex);
  return (
    <ExpensesOutput
      expenses={expensesCtx.expenses}
      expensesPeriod="Total"
      fallbackText="No registered Expenses found !"
    />
  );
}

export default AllExpenses;

const styles = StyleSheet.create({});
