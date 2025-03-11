export const CATEGORIES = [
  { id: 1, name: "Food", icon: "fast-food" },
  { id: 2, name: "Transport", icon: "bus" },
  { id: 3, name: "Shopping", icon: "cart" },
  { id: 4, name: "Entertainment", icon: "musical-notes" },
  { id: 5, name: "Health", icon: "heart" },
  { id: 6, name: "Education", icon: "book" },
  { id: 7, name: "Social Relations", icon: "people" },
  { id: 8, name: "Work", icon: "briefcase" },
  { id: 9, name: "Living", icon: "home" },
  { id: 10, name: "Others", icon: "help-circle" },
];

export function getCategoryName(categoryId) {
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.name : "Others";
}
