import { useMemo } from "react";
import salesHistory from "@/data/sales-history.json";

// Filter Orders By Mode
export function useFilteredOrders(filterMode, selectedYear, selectedMonth) {
  return useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (filterMode === "today") {
      return salesHistory.filter((order) => order.createdAt.startsWith(todayStr));
    }

    return salesHistory.filter((order) => {
      const date = new Date(order.createdAt);
      const yearMatch = selectedYear === "All" || date.getFullYear().toString() === selectedYear;
      const monthMatch = selectedMonth === "All" || (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth;
      return yearMatch && monthMatch;
    });
  }, [filterMode, selectedYear, selectedMonth]);
}