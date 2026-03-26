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

// Helper: normalize orders for safe comparison
const normalizeOrders = (orders = []) => {
  return [...orders]
    .map((order) => ({
      productId:
        typeof order.productId === "object"
          ? order.productId?._id
          : order.productId,
      quantity: order.quantity,
    }))
    .filter((item) => item.productId)
    .sort((a, b) => String(a.productId).localeCompare(String(b.productId)));
};

// Helper: compare order arrays
const areOrdersEqual = (ordersA = [], ordersB = []) => {
  const a = normalizeOrders(ordersA);
  const b = normalizeOrders(ordersB);

  if (a.length !== b.length) return false;

  return a.every((item, index) => {
    return (
      item.productId === b[index].productId &&
      item.quantity === b[index].quantity
    );
  });
};

export default function TakeOrderPage() {
  // STEP STATE (0 = masa seçimi, 1 = ürün seçimi)
  const [step, setStep] = useState(0);

  // SEÇİLİ MASA ID (tek source of truth)
  const [selectedTableId, setSelectedTableId] = useState(null);

  // SIDEBAR (mobile)
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);

  // MASA FİLTRELERİ
  const [selectedArea, setSelectedArea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ÜRÜN FİLTRELERİ
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // QUICK ORDER SABİTLERİ
  const QUICK_ORDER_AREA_NAME = "Hızlı Sipariş";
  const QUICK_ORDER_TABLE_COUNT = 3;

  // QUICK ORDER UI STATE
  const [isQuickOrderLoading, setIsQuickOrderLoading] = useState(false);
  const [quickOrderSetupModalOpen, setQuickOrderSetupModalOpen] = useState(false);

  // AREA DATA
  const { data: areas = [], refetch: refetchAreas } = useAreas();

  // TABLE DATA (backend source)
  const { data: tables = [], refetch: refetchTables } = useTables();

  // QUICK ORDER MUTATIONS
  const addArea = useAddArea();
  const addTable = useAddTable();

  // SEÇİLİ MASA (derived state)
  const selectedTable = useMemo(() => {
    return tables.find((table) => table._id === selectedTableId) ?? null;
  }, [tables, selectedTableId]);

  // QUICK ORDER CHECK
  const isQuickOrder =
    typeof selectedTable?.areaId === "object" &&
    selectedTable?.areaId?.name === QUICK_ORDER_AREA_NAME;

  // MASA DURUM TÜRETİMLERİ
  const tableOrders = selectedTable?.orders || [];
  const lastSentOrders = selectedTable?.lastSentOrders || [];

  const hasOrders = tableOrders.length > 0;
  const hasLastSent = lastSentOrders.length > 0;

  const isSentSynced =
    hasOrders && hasLastSent && areOrdersEqual(tableOrders, lastSentOrders);

  const isCancelledState = !hasOrders && hasLastSent;
  const isDraftOrUpdated = hasOrders && !isSentSynced;
  const isAvailable = !hasOrders && !hasLastSent;

  // MOBILE FOOTER LABEL
  const mobileButtonLabel = isQuickOrder
    ? hasOrders
      ? "Siparişi Gönder ve Ödeme Al"
      : "Sipariş Yok"
    : isCancelledState
    ? "Siparişi Sil"
    : isSentSynced
    ? "Ödeme Al"
    : isDraftOrUpdated
    ? "Siparişi Gönder"
    : "Sipariş Yok";

  // MOBILE FOOTER COLOR
  const mobileButtonClass = isQuickOrder
    ? hasOrders
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
      : "bg-[#1c1c1e] text-[#5e5e5e] opacity-50"
    : isCancelledState
    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-200"
    : isSentSynced
    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-200"
    : isDraftOrUpdated
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
    : "bg-[#1c1c1e] text-[#5e5e5e] opacity-50";

  // MOBILE FOOTER DISABLED
  const isMobileButtonDisabled = isQuickOrder ? !hasOrders : isAvailable;

  // QUICK ORDER MODAL AUTO CLOSE
  useEffect(() => {
    if (!quickOrderSetupModalOpen) return;

    const timeout = setTimeout(() => {
      setQuickOrderSetupModalOpen(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [quickOrderSetupModalOpen]);

  // QUICK ORDER: ilk boş slotu otomatik seç
  const handleQuickOrder = async () => {
    if (isQuickOrderLoading) return;

    setIsQuickOrderLoading(true);

    try {
      let shouldShowSetupModal = false;

      // 1) QUICK ORDER AREA VAR MI?
      let quickArea = areas.find((area) => area.name === QUICK_ORDER_AREA_NAME);

      // 2) YOKSA OLUŞTUR
      if (!quickArea) {
        const createdAreaResponse = await addArea.mutateAsync({
          name: QUICK_ORDER_AREA_NAME,
        });

        quickArea = createdAreaResponse?.data;
        shouldShowSetupModal = true;
      }

      // 3) AREA OLUŞTUYSA / YENİDEN ÇEK
      if (!quickArea?._id) {
        const refreshedAreas = await refetchAreas();
        quickArea =
          refreshedAreas?.data?.find((area) => area.name === QUICK_ORDER_AREA_NAME) ??
          null;
      }

      if (!quickArea?._id) {
        throw new Error("Quick order area could not be resolved.");
      }

      // 4) O AREA'YA AİT SLOTLARI BUL
      const currentQuickTables = tables.filter((table) => {
        const areaId =
          typeof table.areaId === "object" ? table.areaId?._id : table.areaId;
        return areaId === quickArea._id;
      });

      // 5) EKSİK SLOT VARSA TAMAMLA
      if (currentQuickTables.length < QUICK_ORDER_TABLE_COUNT) {
        await addTable.mutateAsync({
          areaId: quickArea._id,
          count: QUICK_ORDER_TABLE_COUNT - currentQuickTables.length,
        });

        shouldShowSetupModal = true;
      }

      // 6) MASALARI YENİDEN ÇEK
      const refreshedTables = await refetchTables();
      const latestTables = refreshedTables?.data || [];

      const quickTables = latestTables
        .filter((table) => {
          const areaId =
            typeof table.areaId === "object" ? table.areaId?._id : table.areaId;
          return areaId === quickArea._id;
        })
        .sort((a, b) => {
          const aNum = Number(a.tableNumber) || 0;
          const bNum = Number(b.tableNumber) || 0;
          return aNum - bNum;
        });

      // 7) İLK BOŞ SLOTU BUL
      const availableQuickSlot = quickTables.find((table) => {
        const hasOrders = (table.orders?.length || 0) > 0;
        const hasLastSentOrders = (table.lastSentOrders?.length || 0) > 0;
        return !hasOrders && !hasLastSentOrders;
      });

      // 8) HİÇ SLOT YOKSA / HEPSİ DOLUYSA
      if (!availableQuickSlot) {
        alert("Tüm hızlı satış slotları dolu");
        return;
      }

      // 9) SLOTU OTOMATİK SEÇ VE ÜRÜN ADIMINA GEÇ
      setSelectedTableId(availableQuickSlot._id);
      setStep(1);

      // 10) İLK KURULUMSA MODAL GÖSTER
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

  return (
    <div>
      {/* QUICK ORDER SETUP SUCCESS MODAL */}
      {quickOrderSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-sm">
          <div className="overflow-hidden w-full max-w-sm rounded-2xl bg-white animate-in fade-in zoom-in-95 duration-200 dark:bg-[#1a1a1a]">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#fef3c7]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f59e0b]">
                  <Icons.CheckCircle2 size={24} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-1">
                  Hızlı sipariş hazır!
                </h3>
                <p className="text-sm opacity-60 text-[#121212] dark:text-white">
                  Kasa slotları otomatik oluşturuldu.
                </p>
              </div>
            </div>

            <div className="h-1.5 w-full bg-[#dddddd] dark:bg-[#2d2d2d]">
              <div
                className="h-full bg-[#f59e0b] origin-left"
                style={{ animation: "shrink 2s linear forwards" }}
              />
            </div>

            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {step === 0 ? (
          <>
            {/* STEP 0 → MASA SEÇİMİ */}
            {/* HEADER - FILTER */}
            <div className="h-14.5 shrink-0 flex justify-between gap-4 relative">
              <div className="relative flex-1 md:w-50 md:flex-none">
                <button
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="w-full flex items-center h-14.5 rounded-2xl overflow-hidden"
                >
                  {/* ICON */}
                  <div className="flex items-center justify-center w-14 h-full bg-[#a5b4fc] border-r border-white/20">
                    <Icons.SlidersHorizontal size={20} className="text-white" />
                  </div>

                  {/* LABEL */}
                  <div className="flex-1 flex items-center h-full px-5 bg-[#dddddd] dark:bg-[#2d2d2d] text-gray-400 hover:text-gray-600">
                    <span className="text-sm font-bold">
                      {statusFilter === "all"
                        ? "Tümü"
                        : statusFilter === "available"
                        ? "Müsait"
                        : "Dolu"}
                    </span>

                    <Icons.ChevronDown
                      size={16}
                      className={`ml-auto transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* DROPDOWN */}
                {isFilterOpen && (
                  <div className="absolute top-[110%] left-0 z-50 min-w-36 rounded-2xl overflow-hidden bg-[#dddddd] dark:bg-[#2d2d2d] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">
                      Filtre
                    </div>

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
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                          statusFilter === item.id
                            ? "text-[#a5b4fc]"
                            : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK ORDER BUTTON */}
              <button
                onClick={handleQuickOrder}
                disabled={isQuickOrderLoading}
                className="px-8 h-14.5 rounded-2xl bg-[#a5b4fc] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                <Icons.Zap size={18} />
                {isQuickOrderLoading ? "Hazırlanıyor..." : "Hızlı Sipariş"}
              </button>
            </div>

            {/* AREA SLIDER */}
            <AreaSlider
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
              activeAction=""
            />

            <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* TABLE GRID */}
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
            {/* STEP 1 → ÜRÜN SEÇİMİ */}
            {/* HEADER */}
            <div className="flex flex-1 justify-between items-center gap-4">
              {/* SEARCH */}
              <div className="flex w-full md:w-1/2 items-center">
                <button className="flex items-center justify-center w-14 h-14.5 border-r border-white/20 bg-[#a5b4fc] shrink-0 rounded-l-2xl">
                  <Icons.Search size={20} className="text-white" />
                </button>

                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-0 h-14.5 px-4 rounded-r-2xl bg-[#dddddd] text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white"
                />
              </div>

              {/* BACK BUTTON */}
              <button
                onClick={() => {
                  setStep(0);
                }}
                className="flex items-center justify-center w-14 h-14.5 rounded-2xl bg-[#121212] text-white shrink-0 hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
              >
                <Icons.ChevronLeft size={20} />
              </button>
            </div>

            {/* CATEGORY */}
            <CategorySlider
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* PRODUCT GRID */}
            <ProductGrid
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              selectedTable={selectedTable}
              posMode={true}
            />
          </>
        )}
      </div>

      {/* SIDE PANEL (ORDER) */}
      <TakeOrderSidePanel
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTableId}
        step={step}
        setStep={setStep}
        isTakeOrderModalOpen={isTakeOrderModalOpen}
        setIsTakeOrderModalOpen={setIsTakeOrderModalOpen}
        isQuickOrder={isQuickOrder}
      />

      {/* MOBILE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none bg-[#f3f3f3] dark:bg-[#111315] lg:hidden">
        <button
          disabled={isMobileButtonDisabled}
          onClick={() => setIsTakeOrderModalOpen((prev) => !prev)}
          className={`pointer-events-auto w-full py-4 rounded-2xl font-bold active:scale-[0.98] ${mobileButtonClass}`}
        >
          {mobileButtonLabel}
        </button>
      </div>
    </div>
  );
}