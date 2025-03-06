import { FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData) {
  return <ExpenseItem {...itemData.item} />;
}

function ExpensesList({ expenses }) {
  return (
    <FlatList
      nestedScrollEnabled={true}
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}

export default ExpensesList;
