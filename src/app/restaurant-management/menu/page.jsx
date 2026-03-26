"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import CategorySlider from "@/components/menu-management/CategorySlider";
import ProductGrid from "@/components/menu-management/ProductGrid";
import MenuManagementSidePanel from "@/components/menu-management/SidePanel";

export default function MenuManagementPage() {
  // Sidebar State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Action State
  const [activeAction, setActiveAction] = useState("");

  // Editing State
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      {/* Page Content */}
      <div className="mt-26 flex select-none flex-col gap-8 overflow-y-auto px-8 py-6 md:mt-0 md:ml-70 md:py-8 lg:mr-100 lg:py-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex w-full items-center md:w-1/2">
            <button className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-l-2xl border-r border-white/20 bg-[#a5b4fc] p-4.5">
              <Icons.Search size={20} className="text-white" />
            </button>

            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-14.5 min-w-0 flex-1 rounded-r-2xl bg-[#dddddd] px-4 py-4 text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white"
            />
          </div>

          {/* Mobile Add Button */}
          <button
            onClick={() => setIsMenuModalOpen(!isMenuModalOpen)}
            className="flex h-14.5 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#a5b4fc] text-white hover:opacity-90 active:scale-95 lg:hidden"
          >
            <Icons.Plus size={24} strokeWidth={3} />
          </button>
        </header>

        {/* Category Slider */}
        <CategorySlider
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeAction={activeAction}
          setEditingCategory={setEditingCategory}
          setIsMenuModalOpen={setIsMenuModalOpen}
        />

        {/* Divider */}
        <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        {/* Product Grid */}
        <ProductGrid
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          setEditingProduct={setEditingProduct}
          setIsMenuModalOpen={setIsMenuModalOpen}
        />
      </div>

      {/* Side Panel */}
      <MenuManagementSidePanel
        isMenuModalOpen={isMenuModalOpen}
        setIsMenuModalOpen={setIsMenuModalOpen}
        activeAction={activeAction}
        setActiveAction={setActiveAction}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />
    </div>
  );
}