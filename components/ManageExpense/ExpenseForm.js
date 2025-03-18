import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";
import { CATEGORIES } from "../../constants/catergories";

import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "./Input";
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";

function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValues }) {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  const [selectedCategory, setSelectedCategory] = useState(
    defaultValues ? defaultValues.category : null
  );
  const [categoryIsValid, setCategoryIsValid] = useState(true);

  function selectCategoryHandler(categoryId) {
    setSelectedCategory(categoryId);
    setCategoryIsValid(true);
  }

  function inputChangedHandler(inputIdenfifier, enteredValue) {
    if (inputIdenfifier === "amount") {
      enteredValue = enteredValue.replace(",", ".");
    }
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdenfifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  function dateChangedHandler(event, selectedDate) {
    const curDate = selectedDate || inputs.date.value;
    setInputs((curInputs) => {
      return {
        ...curInputs,
        date: { value: getFormattedDate(curDate), isValid: true },
      };
    });
    setShowDatePicker(false);
  }

  function submidHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
      category: selectedCategory,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    const categoryIsValid = selectedCategory !== null;

    if (
      !amountIsValid ||
      !dateIsValid ||
      !descriptionIsValid ||
      !categoryIsValid
    ) {
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      setCategoryIsValid(categoryIsValid);
      return;
    }

    onSubmit(expenseData);
  }

  return (
        <View style={styles.form}> 
          <Text style={styles.title}>Your Expense</Text>
          <View style={styles.inputsRow}>
            <Input
              style={styles.rowInput}
              label="Amount"
              invalid={!inputs.amount.isValid}
              textInputConfig={{
                keyboardType: "decimal-pad",
                onChangeText: inputChangedHandler.bind(this, "amount"),
                value: inputs.amount.value,
              }}
            />
            <View style={styles.dateContainer}>
              <Input
                label="Date"
                invalid={!inputs.date.isValid}
                textInputConfig={{
                  editable: false,
                  value: inputs.date.value,
                }}
              />
              <IconButton
                icon="calendar"
                color="white"
                size={24}
                onPress={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(inputs.date.value || Date.now())}
                  mode="date"
                  display="default"
                  onChange={dateChangedHandler}
                />
              )}
            </View>
          </View>
          <Input
            label="Description"
            invalid={!inputs.description.isValid}
            textInputConfig={{
              multiline: true,
              onChangeText: inputChangedHandler.bind(this, "description"),
              value: inputs.description.value,
            }}
          />
          <Text style={styles.categoryTitle}>Categories</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((category) => (
              <View key={category.id} style={styles.categoryBox}>
                <IconButton
                  icon={category.icon}
                  size={32}
                  color={selectedCategory === category.id ? GlobalStyles.colors.accent500 : "white"}
                  onPress={() => selectCategoryHandler(category.id)}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
          {!categoryIsValid && (
            <Text style={styles.errorText}>Please selecstyle={styles.buttons}t a category!</Text>
          )}
          <View style={styles.buttons}>
            <Button style={styles.button} mode="flat" onPress={onCancel}>
              Cancel
            </Button>
            <Button style={styles.button} onPress={submidHandler}>
              {submitButtonLabel}
            </Button>
          </View>
        </View>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    marginBottom: 20 
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary100,
    marginVertical: 24,
    textAlign: "center",
  },

  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowInput: {
    flex: 1,
  },

  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.primary400,
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  categoryBox: {
    width: "30%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary400,
    margin: 3,
  },

  categoryTitle: {
    marginVertical: 24,
    fontSize: 12,
    color: GlobalStyles.colors.primary100,
    marginBottom: 4,
  },


  categoryText: {
    fontSize: 13,
    color: GlobalStyles.colors.primary200,
    marginTop: 4,
  },

  selectedCategoryText: {
    color: GlobalStyles.colors.accent500,
  },
});
