"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import salesHistory from "@/data/sales-history.json";
import SalesHistorySidePanel from "@/components/sales-history/SalesHistorySidePanel";
import GridView from "@/components/sales-history/GridView";
import ListView from "@/components/sales-history/ListView";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  // redirect("/take-order");

  // Sidebar State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // View State
  const [viewMode] = useState(() => {
    if (typeof window === "undefined") return "grid";
    const savedViewMode = localStorage.getItem("orders-view-mode");
    return savedViewMode === "list" ? "list" : "grid";
  });

  // Filter State
  const [activePayment, setActivePayment] = useState("all");
  const [activeOrder, setActiveOrder] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let data = [...salesHistory];

  if (activePayment === "paid") data = data.filter((order) => order.isPaid);
  if (activePayment === "unpaid") data = data.filter((order) => !order.isPaid);
  if (activeOrder === "preparing") data = data.filter((order) => order.status?.toLowerCase() === "preparing");
  if (activeOrder === "served") data = data.filter((order) => order.status?.toLowerCase() === "served");
  if (sortBy === "highest") data.sort((a, b) => b.totalAmount - a.totalAmount);
  if (sortBy === "newest") data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sortBy === "oldest") data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return data;
  }, [sortBy, activePayment, activeOrder]);

  return (
    <div>
      {/* Page Content */}
      <div className="mt-26 flex select-none flex-col gap-8 overflow-y-auto px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:mr-100 lg:py-10">
        {/* Header */}
        <header className="flex h-14.5 items-center justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsOrderModalOpen(!isOrderModalOpen)}
            className="flex h-14.5 w-14 items-center justify-center rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] lg:hidden"
          >
            <Icons.SlidersHorizontal size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </header>

        {/* Orders Content */}
        {viewMode === "grid" && <GridView filteredOrders={filteredOrders} />}
        {viewMode === "list" && <ListView filteredOrders={filteredOrders} />}
      </div>

      {/* Side Panel */}
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