import * as MailComposer from "expo-mail-composer";
import { Alert } from "react-native";

export async function sendExpenseReportToEmail(
  email,
  expenses,
  title = "Expense Report"
) {
  if (!email) {
    Alert.alert("Error", "No user email found.");
    return;
  }

  const isAvailable = await MailComposer.isAvailableAsync();
  if (!isAvailable) {
    Alert.alert("Error", "No mail app available on this device.");
    return;
  }

  let emailBody = `Here is your expenses report for ${title}:\n\n`;
  let totalAmount = 0;

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    emailBody += `${expense.category}: $${expense.amount.toFixed(2)} - ${
      expense.description
    } on ${date.toLocaleDateString("en-US")}\n\n`;
    totalAmount += expense.amount;
  });

  emailBody += `\nTotal Expenses: $${totalAmount.toFixed(2)}`;

  try {
    await MailComposer.composeAsync({
      recipients: [email],
      subject: title,
      body: emailBody,
    });

    Alert.alert("Successed", "Check your email if you have sent the report !");
  } catch (error) {
    Alert.alert("Error", "Failed to send the report.");
    console.log(error);
  }
}
