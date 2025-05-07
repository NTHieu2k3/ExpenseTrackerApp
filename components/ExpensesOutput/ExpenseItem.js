import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { getFormattedDate } from "../../util/date";
import { useNavigation } from "@react-navigation/native";

function ExpenseItem({ id, description, amount, date, overridden }) {
  const navigation = useNavigation();

  //Truyền ID của item sang ManageExpense
  function expensePressHandler() {
    navigation.navigate("ManageExpense", {
      expenseId: id,
    });
  }

  return (
    <Pressable
      onPress={expensePressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.expenseItem, overridden && styles.overridden]}>
        <View>
          <Text numberOfLines={1} style={[styles.textBase, styles.description]}>
            {description.trim()}
          </Text>
          <Text style={styles.textBase}>{getFormattedDate(date)}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        </View>
      </View>
    </Pressable>
  );
}
export default ExpenseItem;

const styles = StyleSheet.create({
  expenseItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.primary700,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    marginHorizontal: 10,
  },

  textBase: {
    color: GlobalStyles.colors.primary50,
  },

  description: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    maxWidth: 150,
  },

  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: GlobalStyles.colors.primary100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    minWidth: 80,
  },

  amount: {
    color: GlobalStyles.colors.accent500,
    fontWeight: "bold",
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },

  overridden: {
    backgroundColor: "#ee3131", // hoặc màu nhấn mạnh dễ thấy
    borderLeftWidth: 4,
    borderLeftColor: "red",
  },
});
