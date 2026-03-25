"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { useAreas, useAddArea } from "@/hooks/useAreas";
import { useTables, useAddTable } from "@/hooks/useTables";

// Empty Table Data
const EMPTY_TABLE = { areaId: "", count: "" };

export default function TableManagementSidePanel({ activeAction, setActiveAction, isTableModalOpen, setIsTableModalOpen }) {
  // Areas And Tables Data
  const { data: areas = [] } = useAreas();
  const { data: tables = [] } = useTables();
  // Area Form State
  const [areaData, setAreaData] = useState("");
  // Table Form State
  const [tableData, setTableData] = useState(EMPTY_TABLE);
  // Inline Area Creation Toggle
  const [isCreatingArea, setIsCreatingArea] = useState(false);
  // Area Mutation
  const { mutateAsync: addArea, isPending: isAddingArea } = useAddArea();
  // Table Mutation
  const { mutateAsync: addTable } = useAddTable();

  // Add Area Submit
  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    try {
      await addArea({ name: areaData });
      setActiveAction("");
      setAreaData("");
      setIsCreatingArea(false);
    } catch (err) {
      console.error("Area add error:", err);
      alert("Bölge eklenemedi, lütfen tekrar deneyin.");
    }
  };

  // Add Table Submit
  const handleTableSubmit = async (e) => {
    e.preventDefault();
    let finalAreaId = tableData.areaId;
    try {
      if (isCreatingArea && areaData) {
        const res = await addArea({ name: areaData });
        finalAreaId = res.data._id || res.data.id;
      }
      await addTable({ areaId: finalAreaId, count: parseInt(tableData.count, 10) || 0 });
      setActiveAction("");
      setTableData(EMPTY_TABLE);
      setIsCreatingArea(false);
      setAreaData("");
      setIsTableModalOpen(false);
    } catch (err) {
      console.error("Table add error:", err);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // Close / Back Handler
  const handleClose = () => {
    if (activeAction) {
      setActiveAction("");
      setAreaData("");
      setTableData(EMPTY_TABLE);
      setIsCreatingArea(false);
    } else {
      setIsTableModalOpen(false);
    }
  };

  // Shared Input Class
  const inputClass = "w-full p-4 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]";
  // Shared Label Class
  const labelClass = "pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400";
  // Shared Submit Class
  const submitClass = "w-full mt-auto py-[25.5px] rounded-2xl font-bold bg-[#1e293b] text-white hover:bg-[#334155] active:scale-[0.98]";

  return (
    <div className={`fixed top-26.25 right-0 z-30 flex flex-col overflow-y-auto w-full h-[calc(100dvh-105px)] gap-8 py-6 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:w-100 lg:h-screen lg:translate-x-0 lg:py-10 ${isTableModalOpen ? "translate-x-0" : "translate-x-full"}`}>

      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex flex-1 items-center justify-between h-14.5 p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold capitalize text-white">{activeAction ? activeAction.replace("-", " ") : "Table Management"}</h2>
        </div>
        <button onClick={handleClose} className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-white active:scale-95 dark:bg-[#2d2d2d] ${!activeAction ? "md:hidden" : "md:flex"}`}>
          {activeAction
            ? <Icons.ChevronLeft size={24} className="text-[#a5b4fc]" />
            : <Icons.X size={24} className="text-[#121212] dark:text-white" />}
        </button>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Add Area Form */}
      {activeAction === "add-area" && (
        <form className="flex flex-col flex-1 gap-3 h-full" onSubmit={handleAreaSubmit}>
          <div>
            <label className={labelClass}>Area Name</label>
            <input placeholder="e.g. Terrace" className={inputClass} required value={areaData} onChange={(e) => setAreaData(e.target.value)} />
          </div>
          <button type="submit" disabled={isAddingArea} className={submitClass}>{isAddingArea ? "SAVING..." : "SAVE AREA"}</button>
        </form>
      )}

      {/* Delete Area Info */}
      {activeAction === "delete-area" && (
        <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-red-500/5">
          <div className="p-4 mb-4 rounded-full bg-red-500/10"><Icons.Trash2 className="text-red-500" size={32} /></div>
          <h3 className="font-semibold text-red-600">Delete Area</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">Select an area from the main view to permanently remove it.</p>
        </div>
      )}

      {/* Add Table Form */}
      {activeAction === "add-table" && (
        <form className="flex flex-col flex-1 gap-6 h-full" onSubmit={handleTableSubmit}>
          <div>
            <label className={labelClass}>Area</label>
            {!isCreatingArea ? (
              <div className="relative">
                <select className="w-full p-4 pr-10 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none appearance-none cursor-pointer focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white" required value={tableData.areaId} onChange={(e) => e.target.value === "new" ? setIsCreatingArea(true) : setTableData({ ...tableData, areaId: e.target.value })}>
                  <option value="">Select Area</option>
                  {areas?.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                  <option value="new" className="font-bold text-indigo-500">+ Create New Area</option>
                </select>
                <Icons.ChevronDown className="absolute top-5 right-4 pointer-events-none text-gray-400" size={18} />
              </div>
            ) : (
              <div className="flex gap-3">
                <input placeholder="New Area Name" className="flex-1 p-4 rounded-2xl border border-indigo-500/30 bg-[#dddddd]/50 outline-none dark:bg-[#2d2d2d] dark:text-white" value={areaData} onChange={(e) => setAreaData(e.target.value)} />
                <button type="button" onClick={() => setIsCreatingArea(false)} className="flex items-center justify-center px-4 rounded-2xl text-[13px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 hover:bg-red-500/20">CANCEL</button>
              </div>
            )}
          </div>

          {/* Table Count Controller */}
          <div>
            <label className={labelClass}>Set Table Count</label>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-transparent bg-[#dddddd]/50 dark:bg-[#2d2d2d]">
              <div className="py-8 text-center text-6xl font-black tabular-nums text-[#a5b4fc]">{tableData.count || 0}</div>
              <div className="grid grid-cols-3 gap-px bg-[#dddddd] dark:bg-[#3d3d3d]">
                {[-10, -5, -1, 1, 5, 10].map((val) => (
                  <button key={val} type="button" onClick={() => { const current = parseInt(tableData.count || 0, 10); setTableData({ ...tableData, count: Math.max(0, current + val).toString() }); }} className="py-5 font-bold bg-white text-gray-600 hover:bg-indigo-50 active:scale-95 dark:bg-[#2d2d2d] dark:text-gray-300 dark:hover:bg-[#353535]">
                    {val > 0 ? `+${val}` : val}
                  </button>
                ))}
                {/* Reset Button */}
                <button type="button" onClick={() => setTableData({ ...tableData, count: "0" })} className="col-span-3 py-5 font-bold bg-[#a5b4fc] text-white hover:bg-[#90a3fc] active:brightness-95">RESET COUNTER</button>
              </div>
            </div>
          </div>

          <button type="submit" className={submitClass}>SAVE TABLE</button>
        </form>
      )}

      {/* Delete Table Info */}
      {activeAction === "delete-table" && (
        <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-red-500/5">
          <div className="p-4 mb-4 rounded-full bg-red-500/10"><Icons.Trash2 className="text-red-500" size={32} /></div>
          <h3 className="font-semibold text-red-600">Delete Table</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">Select a table from the main view to permanently remove it.</p>
        </div>
      )}

      {/* Summary Cards And Action Buttons */}
      {!activeAction && (
        <>
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Table Summary</label>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
              {/* Areas Card */}
              <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
                <Icons.Map size={24} className="text-[#495057] dark:text-[#868e96]" />
                <div>
                  <p className="text-[14px] font-bold leading-tight">Kat Bilgisi</p>
                  <h4 className="text-[13px] font-bold opacity-40">{areas?.length || 0} Bölge</h4>
                </div>
              </div>

              {/* Tables Card */}
              <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
                <Icons.LayoutGrid size={24} className="text-[#495057] dark:text-[#868e96]" />
                <div>
                  <p className="text-[14px] font-bold leading-tight">Masa Sayısı</p>
                  <h4 className="text-[13px] font-bold opacity-40">{tables?.length || 0} Adet</h4>
                </div>
              </div>

              {/* Occupancy Card */}
              <div className="col-span-2 flex flex-col justify-between h-38 w-full p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
                <Icons.Users size={24} className="text-white" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[14px] font-bold leading-tight text-white">Doluluk Durumu</p>
                    <h4 className="text-[13px] font-bold opacity-70 text-white">{tables?.filter((t) => t.orders && t.orders.length > 0).length || 0} Masa Dolu</h4>
                  </div>
                  <span className="text-[13px] font-bold opacity-70 text-white">{Math.round(((tables?.filter((t) => t.orders && t.orders.length > 0).length || 0) / (tables?.length || 1)) * 100)}% Doluluk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

          {/* Management Actions */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Management Actions</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveAction("add-area")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                <Icons.FolderPlus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Area</span>
              </button>
              <button onClick={() => { setActiveAction("delete-area"); setIsTableModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
                <Icons.FolderMinus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Delete Area</span>
              </button>
              <button onClick={() => setActiveAction("add-table")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                <Icons.Plus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Table</span>
              </button>
              <button onClick={() => { setActiveAction("delete-table"); setIsTableModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
                <Icons.Trash2 size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Delete Table</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}