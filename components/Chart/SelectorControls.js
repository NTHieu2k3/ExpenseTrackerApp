import React from "react";
import IconButton from "../UI/IconButton";

export default function SelectorControls({
  filterType,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedWeek,
  setSelectedWeek,
}) {
  if (filterType === "year") {
    return (
      <>
        <IconButton
          icon="chevron-back-circle-outline"
          color="white"
          size={28}
          onPress={() => setSelectedYear((prev) => prev - 1)}
        />
        <IconButton
          icon="chevron-forward-circle-outline"
          color="white"
          size={28}
          onPress={() => setSelectedYear((prev) => prev + 1)}
        />
      </>
    );
  }

  if (filterType === "month") {
    return (
      <>
        <IconButton
          icon="chevron-back-circle-outline"
          color="white"
          size={28}
          onPress={() => {
            if (selectedMonth === 1) {
              setSelectedMonth(12);
              setSelectedYear((prev) => prev - 1);
            } else {
              setSelectedMonth((prev) => prev - 1);
            }
          }}
        />
        <IconButton
          icon="chevron-forward-circle-outline"
          color="white"
          size={28}
          onPress={() => {
            if (selectedMonth === 12) {
              setSelectedMonth(1);
              setSelectedYear((prev) => prev + 1);
            } else {
              setSelectedMonth((prev) => prev + 1);
            }
          }}
        />
      </>
    );
  }

  if (filterType === "week") {
    return (
      <>
        <IconButton
          icon="chevron-back-circle-outline"
          color="white"
          size={28}
          onPress={() => setSelectedWeek((prev) => prev - 1)}
        />
        <IconButton
          icon="chevron-forward-circle-outline"
          color="white"
          size={28}
          onPress={() => setSelectedWeek((prev) => prev + 1)}
        />
      </>
    );
  }

  return null;
}
