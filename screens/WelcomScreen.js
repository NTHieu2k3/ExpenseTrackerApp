import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContex } from "../store/auth-contex";
import { fetchMonthlySalary, storeMonthlySalary } from "../util/http";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";

function WelcomeScreen({ navigation }) {
  const [salary, setSalary] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContex);
  const { token, uid } = authCtx;

  useEffect(() => {
    async function checkSalary() {
      const savedData = await fetchMonthlySalary(token, uid);
      if (savedData.salary && savedData.savingsGoal) {
        navigation.replace("ExpensesOverview");
      } else {
        setIsLoading(false);
      }
    }
    checkSalary();
  }, []);

  async function submitSalaryHandler() {
    const numericSalary = parseFloat(salary);
    const numericSavingsGoal = parseFloat(savingsGoal);

    if (isNaN(numericSalary) || numericSalary <= 0) {
      Alert.alert("ERROR", "Please enter a valid number for monthly salary!");
      return;
    }

    if (isNaN(numericSavingsGoal) || numericSavingsGoal < 0) {
      Alert.alert("ERROR", "Please enter a valid number for savings goal!");
      return;
    }

    if (numericSavingsGoal >= numericSalary) {
      Alert.alert("ERROR", "Savings goal must be less than salary!");
      return;
    }

    try {
      await storeMonthlySalary(token, numericSalary, numericSavingsGoal, uid);
      await AsyncStorage.setItem("monthlySalary", numericSalary.toString());
      await AsyncStorage.setItem("savingsGoal", numericSavingsGoal.toString());
      navigation.replace("ExpensesOverview");
    } catch (error) {
      Alert.alert("ERROR", "Can not save your salary and savings goal. Please try again later!");
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalStyles.colors.primary500} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Monthly Salary</Text>
      <Text style={styles.description}>Enter your salary and savings goal to manage your expenses efficiently.</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          style={styles.input}
          placeholder="Your salary"
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.dollarSign}>$</Text>
        <TextInput
          style={styles.input}
          placeholder="Your savings goal"
          keyboardType="numeric"
          value={savingsGoal}
          onChangeText={setSavingsGoal}
        />
      </View>

      <Button onPress={submitSalaryHandler} style={styles.button}>Save</Button>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary700,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: "100%",
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    width: "30%",
  },
});
