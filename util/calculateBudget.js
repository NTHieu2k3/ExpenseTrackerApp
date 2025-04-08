//Tính toán ngân sách chi tiêu, tiết kiệm và còn lại sau chi tiêu
export function calculateBudget(salaryData, filteredExpenses, filterType) {
  let computedIncome, computedSavings, spendingBudget;

  if (filterType === "week") {
    computedIncome = (salaryData.salary || 0) / 4;
    computedSavings = (salaryData.savingsGoal || 0) / 4;
  } else if (filterType === "year") {
    computedIncome = (salaryData.salary || 0) * 12;
    computedSavings = (salaryData.savingsGoal || 0) * 12;
  } else {
    computedIncome = salaryData.salary || 0;
    computedSavings = salaryData.savingsGoal || 0;
  }

  spendingBudget = Math.round(computedIncome - computedSavings);

  const totalExpense =
    filteredExpenses && filteredExpenses.length > 0
      ? filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      : 0;

  let remainingAmount = spendingBudget - totalExpense;

  if (remainingAmount < 0) {
    let deficit = Math.abs(remainingAmount);
    if (computedSavings >= deficit) {
      computedSavings = Math.round(computedSavings - deficit);
      remainingAmount = 0;
    } else {
      remainingAmount = 0;
      computedSavings = 0;
    }
  } else {
    remainingAmount = Math.round(remainingAmount);
  }

  return {
    totalExpenses: totalExpense,
    totalSavings: computedSavings,
    totalRemaining: remainingAmount,
    spendingBudget,
  };
}
