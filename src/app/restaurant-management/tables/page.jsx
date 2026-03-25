"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import AreaSlider from "@/components/table-management/AreaSlider";
import TableGrid from "@/components/table-management/TableGrid";
import TableManagementSidePanel from "@/components/table-management/SidePanel";
import OrderDetailModal from "@/components/table-management/OrderDetailModal";

// Status Filter Options
const STATUS_FILTERS = [
  { id: "all", label: "Tümü", icon: <Icons.LayoutGrid size={18} /> },
  { id: "available", label: "Müsait", icon: <Icons.CheckCircle2 size={18} /> },
  { id: "occupied", label: "Dolu", icon: <Icons.Users size={18} /> },
];

export default function TableManagementPage() {
  // Action State
  const [activeAction, setActiveAction] = useState("");
  // Sidebar State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  // Area And Status Filter State
  const [selectedArea, setSelectedArea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Order Modal State
  const [selectedTableForModal, setSelectedTableForModal] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Table Click Handler
  const handleTableClick = (table) => {
    setSelectedTableForModal(table);
    setIsOrderModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {/* Header */}
        <div className="h-14.5 shrink-0 flex gap-4 relative">
          {/* Status Filter Dropdown */}
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

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-[110%] left-0 z-50 min-w-36 rounded-2xl overflow-hidden bg-[#dddddd] dark:bg-[#2d2d2d] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white bg-[#a5b4fc]">Filtre</div>
                {STATUS_FILTERS.map((s) => (
                  <button key={s.id} onClick={() => { setStatusFilter(s.id); setIsFilterOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold ${statusFilter === s.id ? "text-[#a5b4fc]" : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"}`}>
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Add Button */}
          <div className="flex-1 flex justify-end">
            <button onClick={() => setIsTableModalOpen(!isTableModalOpen)} className="flex items-center justify-center w-14 h-14.5 rounded-2xl bg-[#98a2f3] text-white shrink-0 hover:opacity-90 active:scale-95 dark:bg-white dark:text-black lg:hidden">
              <Icons.Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <AreaSlider selectedArea={selectedArea} setSelectedArea={setSelectedArea} activeAction={activeAction} />

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <TableGrid 
          selectedArea={selectedArea} 
          statusFilter={statusFilter} 
          activeAction={activeAction} 
          onTableClick={handleTableClick}
        />
      </div>

      {/* Order Detail Modal */}
      {isOrderModalOpen && (
        <OrderDetailModal 
          table={selectedTableForModal} 
          onClose={() => setIsOrderModalOpen(false)} 
        />
      )}

      <TableManagementSidePanel
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        isTableModalOpen={isTableModalOpen}
        setIsTableModalOpen={setIsTableModalOpen}
      />
    </div>
  );
}