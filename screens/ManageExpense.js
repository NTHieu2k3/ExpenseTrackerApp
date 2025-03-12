import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContex } from "../store/expenses-contex";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";

import IconButton from "../components/UI/IconButton";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContex } from "../store/auth-contex";

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContex);
  const authCtx = useContext(AuthContex);
  const { token, uid } = authCtx;

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expenese) => expenese.id === editedExpenseId
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId, token, uid);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - Please try again later !");
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        expensesCtx.updateExpense(editedExpenseId, expenseData);
        await updateExpense(editedExpenseId, expenseData, token, uid);
      } else {
        const id = await storeExpense(expenseData, token, uid);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Could not save expense - Please try again later !");
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }
  console.log("editedExpenseId:", editedExpenseId);
  console.log("isEditing:", isEditing);
  console.log("Route Params:", route.params);
  console.log("selectedExpense:", selectedExpense);
  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />
      {isEditing &&
        (console.log("Rendering Trash Icon"),
        (
          <View style={styles.deleteContainer}>
            <IconButton
              icon="trash"
              color="white"
              size={36}
              onPress={deleteExpenseHandler}
            />
          </View>
        ))}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
