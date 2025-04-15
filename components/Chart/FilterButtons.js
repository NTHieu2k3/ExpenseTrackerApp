import React from "react";
import IconButton from "../UI/IconButton";

export default function FilterButtons({ selectedFilter, onChange }) {
  return (
    <>
      <IconButton
        icon="calendar-outline"
        color={selectedFilter === "week" ? "yellow" : "white"}
        size={28}
        onPress={() => onChange("week")}
      />
      <IconButton
        icon="calendar-number-outline"
        color={selectedFilter === "month" ? "yellow" : "white"}
        size={28}
        onPress={() => onChange("month")}
      />
      <IconButton
        icon="calendar"
        color={selectedFilter === "year" ? "yellow" : "white"}
        size={28}
        onPress={() => onChange("year")}
      />
    </>
  );
}
