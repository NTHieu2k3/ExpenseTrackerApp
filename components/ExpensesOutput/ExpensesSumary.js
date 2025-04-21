import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ExpensesSumary({ expenses = [], periodName }) {
  //Tính tổng
  const expensesSum = expenses.reduce((sum, expense) => {
    return sum + (expense.amount || 0);
  }, 0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.period}>{periodName}</Text>
      <Text style={styles.sum}>${expensesSum.toFixed(2)}</Text>
    </View>
  );
}

export default ExpensesSumary;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: GlobalStyles.colors.primary100,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    marginBottom: 20,
  },
  period: {
    fontSize: 14,
    fontWeight: "500",
    color: GlobalStyles.colors.gray700,
  },
  sum: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.accent500,
  },
});
