"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import CategorySlider from "@/components/menu-management/CategorySlider";
import ProductGrid from "@/components/menu-management/ProductGrid";
import MenuManagementSidePanel from "@/components/menu-management/SidePanel";

export default function MenuManagementPage() {
  // Sidebar State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  // Active Action State
  const [activeAction, setActiveAction] = useState("");
  // Editing States
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  // Category And Search Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="flex flex-col gap-8 overflow-y-auto select-none mt-26 md:mt-0 md:ml-70 py-6 px-8 md:py-8 lg:py-10 lg:mr-100">
        {/* Header */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex w-full md:w-1/2 items-center">
            <button className="flex items-center justify-center w-14 h-14.5 p-4.5 border-r border-white/20 bg-[#a5b4fc] shrink-0 rounded-l-2xl">
              <Icons.Search size={20} className="text-white" />
            </button>
            <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-0 h-14.5 py-4 px-4 rounded-r-2xl bg-[#dddddd] text-[#121212] outline-none dark:bg-[#2d2d2d] dark:text-white" />
          </div>
          {/* Mobile Add Button */}
          <button onClick={() => setIsMenuModalOpen(!isMenuModalOpen)} className="flex items-center justify-center w-14 h-14.5 rounded-2xl bg-[#a5b4fc] text-white shrink-0 hover:opacity-90 active:scale-95 lg:hidden">
            <Icons.Plus size={24} strokeWidth={3} />
          </button>
        </div>

        <CategorySlider
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          activeAction={activeAction}
          setEditingCategory={setEditingCategory}
          setIsMenuModalOpen={setIsMenuModalOpen}
        />

        <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

        <ProductGrid
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
          setEditingProduct={setEditingProduct}
          setIsMenuModalOpen={setIsMenuModalOpen}
        />
      </div>

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