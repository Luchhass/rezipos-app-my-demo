"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { useAreas, useAddArea } from "@/hooks/useAreas";
import { useTables, useAddTable } from "@/hooks/useTables";

// Empty Table State
const EMPTY_TABLE = { areaId: "", count: "" };

export default function TableManagementSidePanel({
  activeAction,
  setActiveAction,
  isTableModalOpen,
  setIsTableModalOpen,
}) {
  // Area And Table Data
  const { data: areas = [] } = useAreas();
  const { data: tables = [] } = useTables();

  // Form State
  const [areaData, setAreaData] = useState("");
  const [tableData, setTableData] = useState(EMPTY_TABLE);
  const [isCreatingArea, setIsCreatingArea] = useState(false);

  // Mutations
  const { mutateAsync: addArea, isPending: isAddingArea } = useAddArea();
  const { mutateAsync: addTable } = useAddTable();

  // Add Area Submit
  const handleAreaSubmit = async (event) => {
    event.preventDefault();

    try {
      await addArea({ name: areaData });
      setActiveAction("");
      setAreaData("");
      setIsCreatingArea(false);
    } catch (error) {
      console.error("Area add error:", error);
      alert("Bölge eklenemedi, lütfen tekrar deneyin.");
    }
  };

  // Add Table Submit
  const handleTableSubmit = async (event) => {
    event.preventDefault();

    let finalAreaId = tableData.areaId;

    try {
      if (isCreatingArea && areaData) {
        const response = await addArea({ name: areaData });
        finalAreaId = response.data._id || response.data.id;
      }

      await addTable({
        areaId: finalAreaId,
        count: parseInt(tableData.count, 10) || 0,
      });

      setActiveAction("");
      setTableData(EMPTY_TABLE);
      setIsCreatingArea(false);
      setAreaData("");
      setIsTableModalOpen(false);
    } catch (error) {
      console.error("Table add error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // Close Panel
  const handleClose = () => {
    if (activeAction) {
      setActiveAction("");
      setAreaData("");
      setTableData(EMPTY_TABLE);
      setIsCreatingArea(false);
      return;
    }

    setIsTableModalOpen(false);
  };

  return (
    <div
      className={`fixed top-26.25 right-0 z-30 flex h-[calc(100dvh-105px)] w-full flex-col gap-8 overflow-y-auto border-l border-[#dddddd] bg-[#f3f3f3] px-8 py-6 dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:h-screen lg:w-100 lg:translate-x-0 lg:py-10 ${
        isTableModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex h-14.5 flex-1 items-center justify-between rounded-2xl bg-[#a5b4fc] p-4 md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold capitalize text-white">
            {activeAction ? activeAction.replace("-", " ") : "Table Management"}
          </h2>
        </div>

        <button
          onClick={handleClose}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white active:scale-95 dark:bg-[#2d2d2d] ${
            !activeAction ? "md:hidden" : "md:flex"
          }`}
        >
          {activeAction ? (
            <Icons.ChevronLeft size={24} className="text-[#a5b4fc]" />
          ) : (
            <Icons.X size={24} className="text-[#121212] dark:text-white" />
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Add Area Form */}
      {activeAction === "add-area" && (
        <form onSubmit={handleAreaSubmit} className="flex h-full flex-1 flex-col gap-3">
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Area Name</label>
            <input
              required
              value={areaData}
              onChange={(event) => setAreaData(event.target.value)}
              placeholder="e.g. Terrace"
              className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
            />
          </div>

          <button
            type="submit"
            disabled={isAddingArea}
            className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
          >
            {isAddingArea ? "SAVING..." : "SAVE AREA"}
          </button>
        </form>
      )}

      {/* Delete Area Info */}
      {activeAction === "delete-area" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-red-500/5 p-8 text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-4">
            <Icons.Trash2 size={32} className="text-red-500" />
          </div>

          <h3 className="font-semibold text-red-600">Delete Area</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">
            Select an area from the main view to permanently remove it.
          </p>
        </div>
      )}

      {/* Add Table Form */}
      {activeAction === "add-table" && (
        <form onSubmit={handleTableSubmit} className="flex h-full flex-1 flex-col gap-6">
          {/* Area Select */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Area</label>

            {!isCreatingArea ? (
              <div className="relative">
                <select
                  required
                  value={tableData.areaId}
                  onChange={(event) =>
                    event.target.value === "new"
                      ? setIsCreatingArea(true)
                      : setTableData({ ...tableData, areaId: event.target.value })
                  }
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 pr-10 outline-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white"
                >
                  <option value="">Select Area</option>
                  {areas?.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                  <option value="new" className="font-bold text-indigo-500">
                    + Create New Area
                  </option>
                </select>

                <Icons.ChevronDown size={18} className="pointer-events-none absolute top-5 right-4 text-gray-400" />
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  value={areaData}
                  onChange={(event) => setAreaData(event.target.value)}
                  placeholder="New Area Name"
                  className="flex-1 rounded-2xl border border-indigo-500/30 bg-[#dddddd]/50 p-4 outline-none dark:bg-[#2d2d2d] dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setIsCreatingArea(false)}
                  className="flex items-center justify-center rounded-2xl bg-red-500/10 px-4 text-[13px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/20"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>

          {/* Table Count */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Set Table Count</label>

            <div className="flex flex-col overflow-hidden rounded-2xl border border-transparent bg-[#dddddd]/50 dark:bg-[#2d2d2d]">
              <div className="py-8 text-center text-6xl font-black tabular-nums text-[#a5b4fc]">{tableData.count || 0}</div>

              <div className="grid grid-cols-3 gap-px bg-[#dddddd] dark:bg-[#3d3d3d]">
                {[-10, -5, -1, 1, 5, 10].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      const current = parseInt(tableData.count || 0, 10);
                      setTableData({ ...tableData, count: Math.max(0, current + value).toString() });
                    }}
                    className="bg-white py-5 font-bold text-gray-600 hover:bg-indigo-50 active:scale-95 dark:bg-[#2d2d2d] dark:text-gray-300 dark:hover:bg-[#353535]"
                  >
                    {value > 0 ? `+${value}` : value}
                  </button>
                ))}

                {/* Reset Button */}
                <button
                  type="button"
                  onClick={() => setTableData({ ...tableData, count: "0" })}
                  className="col-span-3 bg-[#a5b4fc] py-5 font-bold text-white hover:bg-[#90a3fc] active:brightness-95"
                >
                  RESET COUNTER
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
          >
            SAVE TABLE
          </button>
        </form>
      )}

      {/* Delete Table Info */}
      {activeAction === "delete-table" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-red-500/5 p-8 text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-4">
            <Icons.Trash2 size={32} className="text-red-500" />
          </div>

          <h3 className="font-semibold text-red-600">Delete Table</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">
            Select a table from the main view to permanently remove it.
          </p>
        </div>
      )}

      {/* Default Panel */}
      {!activeAction && (
        <>
          {/* Summary Cards */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Table Summary</label>

            <div className="grid w-full grid-cols-2 grid-rows-2 gap-3">
              {/* Areas Card */}
              <div className="flex h-38 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:p-5 lg:p-6">
                <Icons.Map size={24} className="text-[#495057] dark:text-[#868e96]" />

                <div>
                  <p className="text-[14px] font-bold leading-tight">Kat Bilgisi</p>
                  <h4 className="text-[13px] font-bold opacity-40">{areas?.length || 0} Bölge</h4>
                </div>
              </div>

              {/* Tables Card */}
              <div className="flex h-38 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:p-5 lg:p-6">
                <Icons.LayoutGrid size={24} className="text-[#495057] dark:text-[#868e96]" />

                <div>
                  <p className="text-[14px] font-bold leading-tight">Masa Sayısı</p>
                  <h4 className="text-[13px] font-bold opacity-40">{tables?.length || 0} Adet</h4>
                </div>
              </div>

              {/* Occupancy Card */}
              <div className="col-span-2 flex h-38 w-full flex-col justify-between rounded-2xl bg-[#a5b4fc] p-4 md:p-5 lg:p-6">
                <Icons.Users size={24} className="text-white" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[14px] font-bold leading-tight text-white">Doluluk Durumu</p>
                    <h4 className="text-[13px] font-bold text-white opacity-70">
                      {tables?.filter((table) => table.orders && table.orders.length > 0).length || 0} Masa Dolu
                    </h4>
                  </div>

                  <span className="text-[13px] font-bold text-white opacity-70">
                    {Math.round(
                      ((tables?.filter((table) => table.orders && table.orders.length > 0).length || 0) / (tables?.length || 1)) * 100
                    )}
                    % Doluluk
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

          {/* Management Actions */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Management Actions</label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveAction("add-area")}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
              >
                <Icons.FolderPlus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Area</span>
              </button>

              <button
                onClick={() => {
                  setActiveAction("delete-area");
                  setIsTableModalOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 text-red-500 hover:bg-red-500/20"
              >
                <Icons.FolderMinus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Delete Area</span>
              </button>

              <button
                onClick={() => setActiveAction("add-table")}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
              >
                <Icons.Plus size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Add Table</span>
              </button>

              <button
                onClick={() => {
                  setActiveAction("delete-table");
                  setIsTableModalOpen(false);
                }}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 text-red-500 hover:bg-red-500/20"
              >
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