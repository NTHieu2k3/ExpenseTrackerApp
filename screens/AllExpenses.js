import { StyleSheet, View } from "react-native";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext } from "react";
import { ExpensesContex } from "../store/expenses-contex";
import { GlobalStyles } from "../constants/styles";

function AllExpenses() {
  const expensesCtx = useContext(ExpensesContex);
  return (
    <View style={styles.container}>
      <ExpensesOutput
      expenses={expensesCtx.expenses}
      expensesPeriod="Total"
      fallbackText="No registered Expenses found !"
    />
    </View>
  );
}

export default AllExpenses;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary700,
    flex: 1,
  },
});
