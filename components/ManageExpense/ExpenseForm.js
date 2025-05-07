import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../../constants/styles";
import { CATEGORIES } from "../../constants/catergories";
import { getFormattedDate } from "../../util/date";

import Button from "../UI/Button";
import DateTimePicker from "@react-native-community/datetimepicker";

function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, defaultValues }) {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? new Date(defaultValues.date) : new Date(),
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

  const [scaleAnim] = useState(new Animated.Value(1));

  function selectCategoryHandler(categoryId) {
    setSelectedCategory(categoryId);
    setCategoryIsValid(true);
    Animated.spring(scaleAnim, {
      toValue: 1.15,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }

  function inputChangedHandler(field, value) {
    if (field === "amount") value = value.replace(",", ".");
    setInputs((curInputs) => ({
      ...curInputs,
      [field]: { value: value, isValid: true },
    }));
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  function dateChangedHandler(event, selectedDate) {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const curDate = selectedDate || inputs.date.value;

    setInputs((curInputs) => ({
      ...curInputs,
      date: { value: curDate, isValid: true },
    }));
    setShowDatePicker(false);
  }

  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
      category: selectedCategory,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    const categoryValid = selectedCategory !== null;

    if (
      !amountIsValid ||
      !dateIsValid ||
      !descriptionIsValid ||
      !categoryValid
    ) {
      setInputs((curInputs) => ({
        amount: { value: curInputs.amount.value, isValid: amountIsValid },
        date: { value: curInputs.date.value, isValid: dateIsValid },
        description: {
          value: curInputs.description.value,
          isValid: descriptionIsValid,
        },
      }));
      setCategoryIsValid(categoryValid);
      return;
    }

    onSubmit(expenseData);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.form}>
        <Text style={styles.title}>💸 Add New Expense</Text>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Ionicons name="cash-outline" size={20} color="#22C55E" />
          <TextInput
            placeholder="Amount"
            placeholderTextColor="white"
            style={[
              styles.input,
              !inputs.amount.isValid && styles.invalidInput,
            ]}
            keyboardType="decimal-pad"
            value={inputs.amount.value}
            onChangeText={inputChangedHandler.bind(this, "amount")}
          />
        </View>
        {!inputs.amount.isValid && (
          <Text style={styles.errorText}>⚠ Amount cannot be empty.</Text>
        )}

        {/* Date Input */}
        <View style={styles.inputGroup}>
          <Ionicons name="calendar-outline" size={20} color="#38BDF8" />
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.input,
                !inputs.date.isValid && styles.invalidInput,
              ]}
            >
              {inputs.date.value
                ? getFormattedDate(inputs.date.value)
                : "Choose date"}
            </Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={inputs.date.value}
            mode="date"
            textColor="white"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={dateChangedHandler}
          />
        )}

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Ionicons name="pencil-outline" size={20} color="#FACC15" />
          <TextInput
            placeholder="Description"
            placeholderTextColor="white"
            multiline
            style={[
              styles.input,
              styles.multilineInput,
              !inputs.description.isValid && styles.invalidInput,
            ]}
            value={inputs.description.value}
            onChangeText={inputChangedHandler.bind(this, "description")}
          />
        </View>
        {!inputs.description.isValid && (
          <Text style={styles.errorText}>⚠ Description cannot be empty.</Text>
        )}
        {/* Category */}
        <Text style={styles.sectionTitle}>📂 Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => selectCategoryHandler(cat.id)}
              style={({ pressed }) => [
                styles.categoryBox,
                selectedCategory === cat.id && styles.categorySelected,
                pressed && { opacity: 0.75 },
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={24}
                color={
                  selectedCategory === cat.id
                    ? GlobalStyles.colors.accent500
                    : "white"
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </View>
        {!categoryIsValid && (
          <Text style={styles.errorText}>⚠ A category must be selected!</Text>
        )}

        {/* Buttons */}
        <View style={styles.buttons}>
          <Button style={styles.button} mode="flat" onPress={onCancel}>
            Cancel
          </Button>
          <Button style={styles.button} onPress={submitHandler}>
            {submitButtonLabel}
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    backgroundColor: GlobalStyles.colors.primary600,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    color: GlobalStyles.colors.primary50,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary400,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  invalidInput: {
    borderColor: GlobalStyles.colors.error500,
    color: GlobalStyles.colors.error500,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  categoryBox: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    margin: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  categorySelected: {
    backgroundColor: "#1e293b",
    borderColor: GlobalStyles.colors.accent500,
    borderWidth: 1.5,
  },
  categoryText: {
    color: "white",
    marginLeft: 8,
    fontSize: 13,
  },
  categoryTextSelected: {
    color: GlobalStyles.colors.accent500,
    fontWeight: "600",
  },
  errorText: {
    color: GlobalStyles.colors.error500,
    textAlign: "center",
    marginVertical: 6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
