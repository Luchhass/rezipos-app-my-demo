"use client";

import { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import salesHistory from "@/data/sales-history.json";
import SalesHistorySidePanel from "@/components/sales-history/SalesHistorySidePanel";
import GridView from "@/components/sales-history/GridView";
import ListView from "@/components/sales-history/ListView";

export default function OrdersPage() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [viewMode] = useState(() => {
    if (typeof window === "undefined") return "grid";
    const savedViewMode = localStorage.getItem("orders-view-mode");
    return savedViewMode === "list" ? "list" : "grid";
  });
  const [activePayment, setActivePayment] = useState("all");
  const [activeOrder, setActiveOrder] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredOrders = useMemo(() => {
    let data = [...salesHistory];

    if (activePayment === "paid") {
      data = data.filter((o) => o.isPaid);
    }

    if (activePayment === "unpaid") {
      data = data.filter((o) => !o.isPaid);
    }

    if (activeOrder === "preparing") {
      data = data.filter((o) => o.status?.toLowerCase() === "preparing");
    }

    if (activeOrder === "served") {
      data = data.filter((o) => o.status?.toLowerCase() === "served");
    }

    if (sortBy === "highest") {
      data.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return data;
  }, [sortBy, activePayment, activeOrder]);

  return (
    <div>
      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        <div className="flex items-center justify-end h-14.5">
          <button
            onClick={() => setIsOrderModalOpen(!isOrderModalOpen)}
            className="flex items-center justify-center w-14 h-14.5 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] lg:hidden"
          >
            <Icons.SlidersHorizontal
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>

        {viewMode === "grid" && <GridView filteredOrders={filteredOrders} />}
        {viewMode === "list" && <ListView filteredOrders={filteredOrders} />}
      </div>

      <SalesHistorySidePanel
        isOrderModalOpen={isOrderModalOpen}
        setIsOrderModalOpen={setIsOrderModalOpen}
        activePayment={activePayment}
        setActivePayment={setActivePayment}
        activeOrder={activeOrder}
        setActiveOrder={setActiveOrder}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  );
}