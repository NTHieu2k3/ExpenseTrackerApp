//Định dạng ngày Y/M/D
export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

//Tính ngày trong RecentExpenses
export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

//Lấy tháng và năm hiện tại 
export function getCurrentMonthYear() {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}