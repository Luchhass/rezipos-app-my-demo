"use client";

import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";

// Components
import AreaSlider from "@/components/table-management/AreaSlider";
import TableGrid from "@/components/table-management/TableGrid";
import CategorySlider from "@/components/menu-management/CategorySlider";
import ProductGrid from "@/components/menu-management/ProductGrid";
import TakeOrderSidePanel from "@/components/take-order/SidePanel";

// Hooks
import { useTables, useAddTable } from "@/hooks/useTables";
import { useAreas, useAddArea } from "@/hooks/useAreas";

// Normalize Orders For Safe Comparison
const normalizeOrders = (orders = []) => {
  return [...orders]
    .map((order) => ({
      productId: typeof order.productId === "object" ? order.productId?._id : order.productId,
      quantity: order.quantity,
    }))
    .filter((item) => item.productId)
    .sort((a, b) => String(a.productId).localeCompare(String(b.productId)));
};

// Compare Order Arrays
const areOrdersEqual = (ordersA = [], ordersB = []) => {
  const a = normalizeOrders(ordersA);
  const b = normalizeOrders(ordersB);

  if (a.length !== b.length) return false;

  return a.every((item, index) => item.productId === b[index].productId && item.quantity === b[index].quantity);
};

export default function TakeOrderPage() {
  // Step State
  const [step, setStep] = useState(0);

  // Selected Table State
  const [selectedTableId, setSelectedTableId] = useState(null);

  // Sidebar State
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);

  // Table Filter State
  const [selectedArea, setSelectedArea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Product Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Quick Order Config
  const QUICK_ORDER_AREA_NAME = "Hızlı Sipariş";
  const QUICK_ORDER_TABLE_COUNT = 1;

  // Quick Order UI State
  const [isQuickOrderLoading, setIsQuickOrderLoading] = useState(false);
  const [quickOrderSetupModalOpen, setQuickOrderSetupModalOpen] = useState(false);

  // Area Data
  const { data: areas = [], refetch: refetchAreas } = useAreas();

  // Table Data
  const { data: tables = [], refetch: refetchTables } = useTables();

  // Quick Order Mutations
  const addArea = useAddArea();
  const addTable = useAddTable();

  // Selected Table
  const selectedTable = useMemo(() => {
    return tables.find((table) => table._id === selectedTableId) ?? null;
  }, [tables, selectedTableId]);

  // Quick Order State
  const isQuickOrder = typeof selectedTable?.areaId === "object" && selectedTable?.areaId?.name === QUICK_ORDER_AREA_NAME;

  // Order State
  const tableOrders = selectedTable?.orders || [];
  const lastSentOrders = selectedTable?.lastSentOrders || [];

  const hasOrders = tableOrders.length > 0;
  const hasLastSent = lastSentOrders.length > 0;

  const isSentSynced = hasOrders && hasLastSent && areOrdersEqual(tableOrders, lastSentOrders);
  const isCancelledState = !hasOrders && hasLastSent;
  const isDraftOrUpdated = hasOrders && !isSentSynced;
  const isAvailable = !hasOrders && !hasLastSent;

  // Auto Close Setup Modal
  useEffect(() => {
    if (!quickOrderSetupModalOpen) return;

    const timeout = setTimeout(() => {
      setQuickOrderSetupModalOpen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [quickOrderSetupModalOpen]);

  // Handle Quick Order
  const handleQuickOrder = async () => {
    if (isQuickOrderLoading) return;

    setIsQuickOrderLoading(true);

    try {
      let shouldShowSetupModal = false;

      // Resolve Quick Order Area
      let quickArea = areas.find((area) => area.name === QUICK_ORDER_AREA_NAME);

      if (!quickArea) {
        const createdAreaResponse = await addArea.mutateAsync({ name: QUICK_ORDER_AREA_NAME });
        quickArea = createdAreaResponse?.data;
        shouldShowSetupModal = true;
      }

      if (!quickArea?._id) {
        const refreshedAreas = await refetchAreas();
        quickArea = refreshedAreas?.data?.find((area) => area.name === QUICK_ORDER_AREA_NAME) ?? null;
      }

      if (!quickArea?._id) {
        throw new Error("Quick order area could not be resolved.");
      }

      // Resolve Quick Order Table
      const currentQuickTables = tables.filter((table) => {
        const areaId = typeof table.areaId === "object" ? table.areaId?._id : table.areaId;
        return areaId === quickArea._id;
      });

      if (currentQuickTables.length < QUICK_ORDER_TABLE_COUNT) {
        await addTable.mutateAsync({
          areaId: quickArea._id,
          count: QUICK_ORDER_TABLE_COUNT - currentQuickTables.length,
        });

        shouldShowSetupModal = true;
      }

      const refreshedTables = await refetchTables();
      const latestTables = refreshedTables?.data || [];

      const quickTables = latestTables
        .filter((table) => {
          const areaId = typeof table.areaId === "object" ? table.areaId?._id : table.areaId;
          return areaId === quickArea._id;
        })
        .sort((a, b) => (Number(a.tableNumber) || 0) - (Number(b.tableNumber) || 0));

      const quickSlot = quickTables[0];

      if (!quickSlot?._id) {
        throw new Error("Quick order slot could not be resolved.");
      }

      // Select Single Quick Slot And Continue
      setSelectedTableId(quickSlot._id);
      setStep(1);

      if (shouldShowSetupModal) {
        setQuickOrderSetupModalOpen(true);
      }
    } catch (error) {
      console.error("Quick order setup error:", error);
      alert("Hızlı sipariş hazırlanamadı");
    } finally {
      setIsQuickOrderLoading(false);
    }
  };

  console.log(tables)

  return (
    <div>
      {/* Quick Order Success Modal */}
      {quickOrderSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            {/* Modal Content */}
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              {/* Success Icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fef3c7]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f59e0b]">
                  <Icons.CheckCircle2 size={24} className="text-white" />
                </div>
              </div>

              {/* Success Text */}
              <div>
                <h3 className="mb-1 text-xl font-bold text-[#121212] dark:text-white">Hızlı sipariş hazır!</h3>
                <p className="text-sm text-[#121212] opacity-60 dark:text-white">Kasa slotu otomatik hazırlandı.</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div className="h-full origin-left bg-[#f59e0b]" style={{ animation: "shrink 2s linear forwards" }} />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="mt-26 pb-26 flex select-none flex-col gap-8 overflow-y-auto px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:mr-100 lg:py-10">
        {step === 0 ? (
          <>
            {/* Table Selection */}
            <header className="relative flex h-14.5 shrink-0 justify-between gap-4">
              {/* Status Filter */}
              <div className="relative flex-1 md:w-50 md:flex-none">
                <button onClick={() => setIsFilterOpen((prev) => !prev)} className="flex h-14.5 w-full items-center overflow-hidden rounded-2xl">
                  <div className="flex h-full w-14 items-center justify-center border-r border-white/20 bg-[#a5b4fc]">
                    <Icons.SlidersHorizontal size={20} className="text-white" />
                  </div>

                  <div className="flex h-full flex-1 items-center bg-[#dddddd] px-5 text-gray-400 hover:text-gray-600 dark:bg-[#2d2d2d]">
                    <span className="text-sm font-bold">
                      {statusFilter === "all" ? "Tümü" : statusFilter === "available" ? "Müsait" : "Dolu"}
                    </span>
                    <Icons.ChevronDown size={16} className={`ml-auto transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                  <div className="absolute top-[110%] left-0 z-50 min-w-36 overflow-hidden rounded-2xl bg-[#dddddd] animate-in fade-in zoom-in-95 duration-200 dark:bg-[#2d2d2d]">
                    <div className="bg-[#a5b4fc] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">Filtre</div>

                    {[
                      { id: "all", label: "Tümü", icon: <Icons.LayoutGrid size={18} /> },
                      { id: "available", label: "Müsait", icon: <Icons.CheckCircle2 size={18} /> },
                      { id: "occupied", label: "Dolu", icon: <Icons.Users size={18} /> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setStatusFilter(item.id);
                          setIsFilterOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold ${
                          statusFilter === item.id ? "text-[#a5b4fc]" : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Order Button */}
              <button
                onClick={handleQuickOrder}
                disabled={isQuickOrderLoading}
                className="flex h-14.5 items-center justify-center gap-2 rounded-2xl bg-[#a5b4fc] px-8 font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <Icons.Zap size={18} />
                {isQuickOrderLoading ? "Hazırlanıyor..." : "Hızlı Sipariş"}
              </button>
            </header>

            {/* Area Slider */}
            <AreaSlider selectedArea={selectedArea} setSelectedArea={setSelectedArea} activeAction="" />

            {/* Divider */}
            <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* Table Grid */}
            <TableGrid
              selectedArea={selectedArea}
              statusFilter={statusFilter}
              activeAction=""
              setSelectedTable={setSelectedTableId}
              setStep={setStep}
            />
          </>
        ) : (
          <>
            {/* Product Selection */}
            <header className="flex items-center justify-between gap-4">
              {/* Search Input */}
              <div className="flex w-full items-center md:w-1/2">
                <button className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-l-2xl border-r border-white/20 bg-[#a5b4fc]">
                  <Icons.Search size={20} className="text-white" />
                </button>

                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-14.5 min-w-0 flex-1 rounded-r-2xl bg-[#dddddd] px-4 text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white"
                />
              </div>

              {/* Back Button */}
              <button
                onClick={() => setStep(0)}
                className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#121212] text-white hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
              >
                <Icons.ChevronLeft size={20} />
              </button>
            </header>

            {/* Category Slider */}
            <CategorySlider selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            {/* Divider */}
            <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* Product Grid */}
            <ProductGrid selectedCategory={selectedCategory} searchTerm={searchTerm} selectedTable={selectedTable} posMode />
          </>
        )}
      </div>

      {/* Side Panel */}
      <TakeOrderSidePanel
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTableId}
        step={step}
        setStep={setStep}
        isTakeOrderModalOpen={isTakeOrderModalOpen}
        setIsTakeOrderModalOpen={setIsTakeOrderModalOpen}
        isQuickOrder={isQuickOrder}
      />

      {/* Mobile Footer */}
      <div className="pointer-events-none md:ml-70 lg:ml-0 fixed right-0 bottom-0 left-0 bg-[#f3f3f3] px-8 pb-6 pt-6 dark:bg-[#111315] lg:hidden">
        <button
          disabled={isQuickOrder ? !hasOrders : isAvailable}
          onClick={() => setIsTakeOrderModalOpen((prev) => !prev)}
          className={`pointer-events-auto w-full rounded-2xl py-4 text-lg font-bold active:scale-[0.98] disabled:opacity-50 ${
            isQuickOrder
              ? hasOrders
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
                : "bg-[#1c1c1e] text-[#5e5e5e]"
              : isCancelledState
              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-200"
              : isSentSynced
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-200"
              : isDraftOrUpdated
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
              : "bg-[#1c1c1e] text-[#5e5e5e]"
          }`}
        >
          {isQuickOrder
            ? hasOrders
              ? "Hızlı Siparişi Gör"
              : "Sipariş Yok"
            : isCancelledState
            ? "İptal Detayını Gör"
            : isSentSynced
            ? "Ödeme Detayını Gör"
            : isDraftOrUpdated
            ? "Sipariş Detayını Gör"
            : "Sipariş Yok"}
        </button>
      </div>
    </div>
  );
}