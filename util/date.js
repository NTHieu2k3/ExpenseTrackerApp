export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

export function getCurrentMonthYear() {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Tháng bắt đầu từ 0 nên phải +1
  };
}