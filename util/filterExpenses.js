export function filterExpenses(expenses, filterType, selectedYear, selectedMonth, selectedWeek) {
    if (!Array.isArray(expenses)) return [];
    
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
  
      if (filterType === "week") {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = currentDate.getDay();
        
        startOfWeek.setDate(
          currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
        );
        startOfWeek.setDate(startOfWeek.getDate() + selectedWeek * 7);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
  
        startOfWeek.setHours(0, 0, 0, 0);
        endOfWeek.setHours(23, 59, 59, 999);
  
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
  