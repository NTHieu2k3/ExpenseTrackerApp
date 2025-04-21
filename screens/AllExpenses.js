import { StyleSheet, View, Text, Pressable } from "react-native";
import { useContext, useState, useMemo } from "react";
import { ExpensesContex } from "../store/expenses-contex";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { GlobalStyles } from "../constants/styles";

const sortOptions = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "amount-asc", label: "Amount ↑" },
  { id: "amount-desc", label: "Amount ↓" },
];

function AllExpenses() {
  const expensesCtx = useContext(ExpensesContex);
  const [sortType, setSortType] = useState("newest");

  const sortedExpenses = useMemo(() => {
    const expenses = [...expensesCtx.expenses];

    switch (sortType) {
      case "oldest":
        return expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "amount-asc":
        return expenses.sort((a, b) => a.amount - b.amount);
      case "amount-desc":
        return expenses.sort((a, b) => b.amount - a.amount);
      default:
        return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [sortType, expensesCtx.expenses]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {sortType === "newest" && "🆕 Latest Expenses"}
        {sortType === "oldest" && "📜 Oldest Expenses"}
        {sortType === "amount-asc" && "💵 Lowest First"}
        {sortType === "amount-desc" && "💰 Highest First"}
      </Text>
      <View style={styles.sortRow}>
        {sortOptions.map((option) => (
          <Pressable
            key={option.id}
            onPress={() => setSortType(option.id)}
            style={[
              styles.sortButton,
              sortType === option.id && styles.activeSort,
            ]}
          >
            <Text
              style={[
                styles.sortText,
                sortType === option.id && styles.activeText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.outputWrapper}>
        <ExpensesOutput
          expenses={sortedExpenses}
          expensesPeriod="Total"
          fallbackText="No expenses found."
        />
      </View>
    </View>
  );
}

export default AllExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
    textAlign: "center",
    marginBottom: 12,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  sortButton: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  activeSort: {
    backgroundColor: GlobalStyles.colors.accent500,
  },
  sortText: {
    color: GlobalStyles.colors.primary100,
    fontWeight: "500",
  },
  activeText: {
    color: "white",
    fontWeight: "bold",
  },
  outputWrapper: {
    flex: 1,
  },
});
