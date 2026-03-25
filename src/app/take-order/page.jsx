"use client";

import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import AreaSlider from "@/components/table-management/AreaSlider";
import TableGrid from "@/components/table-management/TableGrid";
import CategorySlider from "@/components/menu-management/CategorySlider";
import ProductGrid from "@/components/menu-management/ProductGrid";
import TakeOrderSidePanel from "@/components/take-order/SidePanel";

export default function TakeOrderPage() {
  // Step State
  const [step, setStep] = useState(0);

  // Selected Table State
  const [selectedTable, setSelectedTable] = useState(null);

  // Basket Items State
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Sidebar State
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);

  // Table Occupancy Snapshot
  const [wasOccupied, setWasOccupied] = useState(false);

  // Area Filter State (Take Order Table Step)
  const [selectedArea, setSelectedArea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Category And Search Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sync Occupancy On Step Change
  useEffect(() => {
    if (step === 1 && selectedTable) {
      setWasOccupied(!!(selectedTable.orders && selectedTable.orders.length > 0));
    }
    if (step === 0) setWasOccupied(false);
  }, [step, selectedTable]);

  return (
    <div>
      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {step === 0 ? (
          // Table Selection Step
          <>
            {/* Header */}
            <div className="h-14.5 shrink-0 flex gap-4 relative">
              <div className="relative flex-1 md:w-50 md:flex-none">
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full flex items-center h-14.5 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-center w-14 h-full bg-[#a5b4fc] border-r border-white/20">
                    <Icons.SlidersHorizontal size={20} className="text-white" />
                  </div>
                  <div className="flex-1 flex items-center h-full px-5 bg-[#dddddd] dark:bg-[#2d2d2d] text-gray-400 hover:text-gray-600">
                    <span className="text-sm font-bold">{statusFilter === "all" ? "Tümü" : statusFilter === "available" ? "Müsait" : "Dolu"}</span>
                    <Icons.ChevronDown size={16} className={`ml-auto text-gray-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {isFilterOpen && (
                  <div className="absolute top-[110%] left-0 z-50 min-w-36 rounded-2xl overflow-hidden bg-[#dddddd] dark:bg-[#2d2d2d] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">Filtre</div>
                    {[
                      { id: "all", label: "Tümü", icon: <Icons.LayoutGrid size={18} /> },
                      { id: "available", label: "Müsait", icon: <Icons.CheckCircle2 size={18} /> },
                      { id: "occupied", label: "Dolu", icon: <Icons.Users size={18} /> },
                    ].map((s) => (
                      <button key={s.id} onClick={() => { setStatusFilter(s.id); setIsFilterOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold ${statusFilter === s.id ? "text-[#a5b4fc]" : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"}`}>
                        {s.icon}{s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <AreaSlider selectedArea={selectedArea} setSelectedArea={setSelectedArea} activeAction="" />
            <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />
            <TableGrid selectedArea={selectedArea} statusFilter={statusFilter} activeAction="" setSelectedTable={setSelectedTable} setSelectedProducts={setSelectedProducts} setStep={setStep} />
          </>
        ) : (
          // Menu Selection Step
          <>
            {/* Header */}
            <div className="flex flex-1 justify-between items-center gap-4">
              <div className="flex w-full md:w-1/2 items-center">
                <button className="flex items-center justify-center w-14 h-14.5 p-4.5 border-r border-white/20 bg-[#a5b4fc] shrink-0 rounded-l-2xl">
                  <Icons.Search size={20} className="text-white" />
                </button>
                <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-0 h-14.5 py-4 px-4 rounded-r-2xl bg-[#dddddd] text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white" />
              </div>
              
              <button onClick={() => { setStep(0); setSelectedProducts([]); }} className="flex items-center justify-center w-14 h-14.5 rounded-2xl bg-[#121212] text-white shrink-0 hover:opacity-90 active:scale-95 dark:bg-white dark:text-black">
                <Icons.ChevronLeft size={20} />
              </button>
            </div>

            <CategorySlider selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            <ProductGrid
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          </>
        )}
      </div>

      {/* Sidebar */}
      <TakeOrderSidePanel
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        step={step}
        setStep={setStep}
        isTakeOrderModalOpen={isTakeOrderModalOpen}
        setIsTakeOrderModalOpen={setIsTakeOrderModalOpen}
        wasOccupied={wasOccupied}
        setWasOccupied={setWasOccupied}
      />

      {/* Mobile Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none bg-[#f3f3f3] dark:bg-[#111315] lg:hidden">
        <button
          disabled={!wasOccupied && selectedProducts.length === 0}
          onClick={() => setIsTakeOrderModalOpen(!isTakeOrderModalOpen)}
          className={`pointer-events-auto w-full py-4 rounded-2xl font-bold active:scale-[0.98] ${wasOccupied || selectedProducts.length > 0 ? "bg-white text-black" : "bg-[#1c1c1e] text-[#5e5e5e] opacity-50"}`}
        >
          {!wasOccupied ? `Add to Order (${selectedProducts.length})` : selectedProducts.length === 0 ? "Siparişi İptal Et" : "Siparişi Güncelle"}
        </button>
      </div>
    </div>
  );
}