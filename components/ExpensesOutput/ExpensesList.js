import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import ExpenseItem from "./ExpenseItem";
import { CATEGORIES } from "../../constants/catergories";
import { GlobalStyles } from "../../constants/styles";

const DEFAULT_VISIBLE = 3;

function ExpensesList({ expenses }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});

  const grouped = expenses.reduce((acc, exp) => {
    const catId = Number(exp.category);
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(exp);
    return acc;
  }, {});

  function toggleCategory(catId) {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  }

  function toggleShowMore(catId, total) {
    setVisibleCounts((prev) => ({
      ...prev,
      [catId]: prev[catId] === total ? DEFAULT_VISIBLE : total,
    }));
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
      {Object.entries(grouped).map(([catId, items]) => {
        const category = CATEGORIES.find((c) => c.id === +catId);
        if (!category) return null;

        const expanded = expandedCategories[catId];
        const visible = visibleCounts[catId] || DEFAULT_VISIBLE;
        const total = items.reduce((sum, e) => sum + e.amount, 0).toFixed(2);

        return (
          <View key={catId} style={styles.categoryCard}>
            <Pressable
              onPress={() => toggleCategory(catId)}
              style={({ pressed }) => [
                styles.categoryHeader,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={styles.categoryLeft}>
                <Ionicons
                  name={category.icon}
                  size={22}
                  color={GlobalStyles.colors.accent500}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categoryTotal}>Total: ${total}</Text>
                </View>
              </View>
              <Ionicons
                name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color={GlobalStyles.colors.primary100}
              />
            </Pressable>

            {expanded && (
              <View style={styles.expenseListWrapper}>
                {items.slice(0, visible).map((e) => (
                  <ExpenseItem key={e.id} {...e} />
                ))}
                {items.length > DEFAULT_VISIBLE && (
                  <Pressable
                    onPress={() => toggleShowMore(catId, items.length)}
                    style={({ pressed }) => [
                      styles.showMoreBtn,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={styles.showMoreText}>
                      {visible === items.length ? "Show less" : "Show more"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default ExpensesList;

const styles = StyleSheet.create({
  categoryCard: {
    backgroundColor: GlobalStyles.colors.primary600,
    borderRadius: 14,
    marginBottom: 16,
    padding: 10,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: GlobalStyles.colors.primary400,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary50,
  },
  categoryTotal: {
    fontSize: 13,
    color: GlobalStyles.colors.primary200,
  },
  expenseListWrapper: {
    paddingTop: 10,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
  },
  showMoreBtn: {
    marginTop: 8,
    alignSelf: "center",
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  showMoreText: {
    color: GlobalStyles.colors.primary100,
    fontWeight: "600",
  },
});
