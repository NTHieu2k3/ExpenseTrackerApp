import { useState } from "react";
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ExpenseItem from "./ExpenseItem";

function ExpensesList({ expenses }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_ITEMS = 3;

  const visibleExpenses = expanded ? expenses : expenses.slice(0, MAX_ITEMS);

  function toggleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled={true}
        data={visibleExpenses}
        renderItem={({ item }) => <ExpenseItem {...item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
      {expenses.length > MAX_ITEMS && (
        <TouchableOpacity onPress={toggleExpand}>
          <Text style={styles.showMoreText}>
            {expanded ? "Less ▲" : "More ▼"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ExpensesList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },

  showMoreText: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
});
