import { useContext, useLayoutEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Pressable,
} from "react-native";
import { GlobalStyles } from "../constants/styles";
import { ExpensesContex } from "../store/expenses-contex";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";
import { Ionicons } from "@expo/vector-icons";
import { AuthContex } from "../store/auth-contex";

import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContex);
  const authCtx = useContext(AuthContex);
  const { token, uid } = authCtx;

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  //Tìm expense đang chỉnh sửa trong danh sách
  const selectedExpense = expensesCtx.expenses.find(
    (expenese) => expenese.id === editedExpenseId
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  //Cập nhật tiêu đề Edit hay Add
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  //Xử lý button(icon trash) Delete
  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpense(editedExpenseId, token, uid);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        "Could not delete expense - Please try again later !"
      );
      console.log(error);
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  function cancelHandler() {
    navigation.goBack();
  }

  //Xử lý button Update/Add
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
      console.log(error);
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ExpenseForm
            submitButtonLabel={isEditing ? "Update" : "Add"}
            onCancel={cancelHandler}
            onSubmit={confirmHandler}
            defaultValues={selectedExpense}
          />
          {isEditing && (
            <View style={styles.deleteContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={deleteExpenseHandler}
              >
                <Ionicons
                  name="trash-bin-outline"
                  size={20}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.deleteText}>Delete Expense</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },

  scrollContainer: {
    paddingBottom: 20,
  },

  deleteContainer: {
    width: "100%",
    flex: 1,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
    marginBottom: 20,
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.error500,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
