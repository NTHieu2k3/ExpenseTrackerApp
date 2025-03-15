import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import ExpensesSumary from "./ExpensesSumary";
import ExpensesList from "./ExpensesList";
import { GlobalStyles } from "../../constants/styles";
import { CATEGORIES } from "../../constants/catergories";


function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const groupedExpenses = (expenses ?? []).reduce((acc, expense) => {
    const categoryId = expense.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(expense);
    return acc;
  }, {});

  function toggleCategory(category) {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }

  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  if (expenses.length > 0) {
    content = (
      <ScrollView>
        {Object.keys(groupedExpenses).map((categoryId) => {
          const category = CATEGORIES.find((cat) => cat.id == categoryId);
          return (
            <View key={categoryId} style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => toggleCategory(categoryId)}
                style={styles.categoryHeader}
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.categoryTitle}>{category.name}</Text>
              </TouchableOpacity>
              {expandedCategories[categoryId] && (
                <ExpensesList expenses={groupedExpenses[categoryId]} />
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ExpensesSumary expenses={expenses} periodName={expensesPeriod} />
      {content}
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  infoText: {
    color: GlobalStyles.colors.primary50,
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },

  categoryContainer: {
    marginBottom: 16,
    borderBottomWidth:1,
    borderColor: GlobalStyles.colors.primary400,
  },

  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  icon: {
    marginRight: 10,
    color: GlobalStyles.colors.accent500,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
  },
});
