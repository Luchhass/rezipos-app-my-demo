"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";

// Components
import AreaSlider from "@/components/table-management/AreaSlider";
import TableGrid from "@/components/table-management/TableGrid";
import CategorySlider from "@/components/menu-management/CategorySlider";
import ProductGrid from "@/components/menu-management/ProductGrid";
import TakeOrderSidePanel from "@/components/take-order/SidePanel";

// Hooks
import { useTables } from "@/hooks/useTables";

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

  // TABLE DATA (backend source)
  const { data: tables = [] } = useTables();

  // SEÇİLİ MASA (derived state)
  const selectedTable = useMemo(() => {
    return tables.find((table) => table._id === selectedTableId) ?? null;
  }, [tables, selectedTableId]);

  // MASA DURUM TÜRETİMLERİ
  const tableOrders = selectedTable?.orders || [];

  // daha önce gönderilmiş sipariş var mı
  const hasLastSent = (selectedTable?.lastSentOrders?.length || 0) > 0;

  // masa status (draft | sent)
  const tableStatus = selectedTable?.status || "draft";

  // iptal state (kırmızı durum)
  const isCancelledState =
    tableStatus === "draft" &&
    tableOrders.length === 0 &&
    hasLastSent;

  return (
    <div>
      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {step === 0 ? (
          <>
            {/* STEP 0 → MASA SEÇİMİ */}
            {/* HEADER - FILTER */}
            <div className="h-14.5 shrink-0 flex gap-4 relative">
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
      />

      {/* MOBILE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none bg-[#f3f3f3] dark:bg-[#111315] lg:hidden">
        <button
          disabled={tableOrders.length === 0 && !isCancelledState}
          onClick={() => setIsTakeOrderModalOpen((prev) => !prev)}
          className={`pointer-events-auto w-full py-4 rounded-2xl font-bold ${
            tableOrders.length > 0 || isCancelledState
              ? "bg-white text-black"
              : "bg-[#1c1c1e] text-[#5e5e5e] opacity-50"
          }`}
        >
          {isCancelledState
            ? "Siparişi İptal Et"
            : tableOrders.length > 0
            ? `Siparişi Gör (${tableOrders.length})`
            : "Sipariş Yok"}
        </button>
      </div>
    </div>
  );
}
