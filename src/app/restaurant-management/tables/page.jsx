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

  // Filter State
  const [selectedArea, setSelectedArea] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Order Modal State
  const [selectedTableForModal, setSelectedTableForModal] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Handle Table Click
  const handleTableClick = (table) => {
    setSelectedTableForModal(table);
    setIsOrderModalOpen(true);
  };

  return (
    <div>
      {/* Page Content */}
      <div className="mt-26 flex select-none flex-col gap-8 overflow-y-auto px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:mr-100 lg:py-10">
        {/* Header */}
        <header className="relative flex h-14.5 shrink-0 gap-4">
          {/* Status Filter */}
          <div className="relative flex-1 md:w-50 md:flex-none">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex h-14.5 w-full items-center overflow-hidden rounded-2xl">
              <div className="flex h-full w-14 items-center justify-center border-r border-white/20 bg-[#a5b4fc]">
                <Icons.SlidersHorizontal size={20} className="text-white" />
              </div>

              <div className="flex h-full flex-1 items-center bg-[#dddddd] px-5 text-gray-400 hover:text-gray-600 dark:bg-[#2d2d2d]">
                <span className="text-sm font-bold">
                  {statusFilter === "all" ? "Tümü" : statusFilter === "available" ? "Müsait" : "Dolu"}
                </span>
                <Icons.ChevronDown size={16} className={`ml-auto text-gray-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-[110%] left-0 z-50 min-w-36 overflow-hidden rounded-2xl bg-[#dddddd] animate-in fade-in zoom-in-95 duration-200 dark:bg-[#2d2d2d]">
                <div className="bg-[#a5b4fc] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white">Filtre</div>

                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => {
                      setStatusFilter(status.id);
                      setIsFilterOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-bold ${statusFilter === status.id ? "text-[#a5b4fc]" : "text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"}`}
                  >
                    {status.icon}
                    {status.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Add Button */}
          <div className="flex flex-1 justify-end">
            <button
              onClick={() => setIsTableModalOpen(!isTableModalOpen)}
              className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#98a2f3] text-white hover:opacity-90 active:scale-95 dark:bg-white dark:text-black lg:hidden"
            >
              <Icons.Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </header>

        {/* Area Slider */}
        <AreaSlider selectedArea={selectedArea} setSelectedArea={setSelectedArea} activeAction={activeAction} />

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Table Grid */}
        <TableGrid selectedArea={selectedArea} statusFilter={statusFilter} activeAction={activeAction} onTableClick={handleTableClick} />
      </div>

      {/* Order Detail Modal */}
      {isOrderModalOpen && <OrderDetailModal table={selectedTableForModal} onClose={() => setIsOrderModalOpen(false)} />}

      {/* Side Panel */}
      <TableManagementSidePanel
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        isTableModalOpen={isTableModalOpen}
        setIsTableModalOpen={setIsTableModalOpen}
      />
    </div>
  );
}