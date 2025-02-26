  export function filtered(expenses) {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (filterType === "week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(
          startOfWeek.getDate() - startOfWeek.getDay() + selectedWeek * 7
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
      }
      if (filterType === "month") {
        return (
          expenseDate.getFullYear() === selectedYear &&
          expenseDate.getMonth() + 1 === selectedMonth
        );
      }
      if (filterType === "year") {
        return expenseDate.getFullYear() === selectedYear;
      }
      return false;
    });
  }
