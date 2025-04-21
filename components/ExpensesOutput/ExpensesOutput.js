import { ScrollView, StyleSheet, Text, View } from "react-native";
import ExpensesSumary from "./ExpensesSumary";
import ExpensesList from "./ExpensesList";
import { GlobalStyles } from "../../constants/styles";

function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
  const hasExpenses = expenses && expenses.length > 0;

  return (
    <View style={styles.container}>
      <ExpensesSumary expenses={expenses} periodName={expensesPeriod} />
      {hasExpenses ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ExpensesList expenses={expenses} groupByCategory />
        </ScrollView>
      ) : (
        <View style={styles.fallbackWrapper}>
          <Text style={styles.infoText}>{fallbackText}</Text>
        </View>
      )}
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  fallbackWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    color: GlobalStyles.colors.primary200,
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    fontStyle: "italic",
  },
});
