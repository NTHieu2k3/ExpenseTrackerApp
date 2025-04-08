import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ExpensesContex } from "../store/expenses-contex";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContex } from "../store/auth-contex";
import { GlobalStyles } from "../constants/styles";

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();
  const authCtx = useContext(AuthContex);
  const expensesCtx = useContext(ExpensesContex);

  //Load expenses khi token và uid thay đổi (khi vừa đăng nhập)
  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses(authCtx.token, authCtx.uid);
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses !");
      }
      setIsFetching(false);
    }
    getExpenses();
  }, [authCtx.token, authCtx.uid]);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  //Lọc expenses trong 7 ngày gần nhất về trước tính từ ngày hôm nay
  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date > date7DaysAgo && expense.date <= today;
  });

  return (
    <View style={styles.container}>
      <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No Expenses registered for the last 7 days"
    />
    </View>
  );
}

export default RecentExpenses;

const styles = StyleSheet.create({
  container: {
      backgroundColor: GlobalStyles.colors.primary700,
      flex: 1,
    },
});
