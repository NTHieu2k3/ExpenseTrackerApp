import { Text } from "react-native";
import { GlobalStyles } from "../constants/styles";

export function processExpenses(expenses, type, year, month, week) {
  const currentDate = new Date();
  const dataMap = new Map();
  let title = "";

  if (type === "week") {
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(
      currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + week * 7
    );

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    title = `Week: ${startOfWeek.getDate()}/${
      startOfWeek.getMonth() + 1
    } - ${endOfWeek.getDate()}/${
      endOfWeek.getMonth() + 1
    }/${startOfWeek.getFullYear()}`;

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const key = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      dataMap.set(key, 0);
    }

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const key = `${expenseDate.getFullYear()}-${
        expenseDate.getMonth() + 1
      }-${expenseDate.getDate()}`;
      if (dataMap.has(key)) {
        dataMap.set(key, dataMap.get(key) + expense.amount);
      }
    });
  }

  if (type === "month") {
    title = `Month: ${month}/${year}`;
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) dataMap.set(i, 0);

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        dataMap.set(
          date.getDate(),
          dataMap.get(date.getDate()) + expense.amount
        );
      }
    });
  }

  if (type === "year") {
    title = `Year: ${year}`;
    for (let i = 1; i <= 12; i++) dataMap.set(i, 0);

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (date.getFullYear() === year) {
        dataMap.set(
          date.getMonth() + 1,
          dataMap.get(date.getMonth() + 1) + expense.amount
        );
      }
    });
  }

  const data = Array.from(dataMap, ([key, amount]) => ({
    value: amount,
    label: type === "week" ? key.split("-")[2] : key.toString(),
    frontColor: GlobalStyles.colors.primary500,
    topLabelComponent: () => (
      <Text
        style={{
          color: "white",
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        {amount > 0 ? amount : ""}
      </Text>
    ),
  }));

  return { data, title };
}
