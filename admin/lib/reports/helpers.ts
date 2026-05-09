import { GroupBy } from "./types";

export function getGroupKey(date: Date, groupBy: GroupBy) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  if (groupBy === "year") {
    return `${year}`;
  }

  if (groupBy === "month") {
    return `${year}-${month}`;
  }

  return `${year}-${month}-${day}`;
}

// ===== Display label =====
export function formatGroupLabel(value: string, groupBy: GroupBy) {
  if (groupBy === "year") {
    return value;
  }

  if (groupBy === "month") {
    const [year, month] = value.split("-");
    return `${month}/${year}`;
  }

  const [year, month, day] = value.split("-");

  return `${day}/${month}/${year}`;
}
