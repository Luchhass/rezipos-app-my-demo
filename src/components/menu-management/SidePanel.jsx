"use client";

import { useState, useEffect } from "react";
import { useCategories, useAddCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useProducts, useAddProduct, useUpdateProduct } from "@/hooks/useProducts";
import * as Icons from "lucide-react";

// Empty Form Data
const EMPTY_FORM = { name: "", price: "", prepTime: "", categoryId: "", description: "", image: null };

export default function MenuManagementSidePanel({ isMenuModalOpen, setIsMenuModalOpen, activeAction, setActiveAction, editingCategory, setEditingCategory, editingProduct, setEditingProduct }) {
  // Categories And Products Data
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();
  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  // Product Form State
  const [formData, setFormData] = useState(EMPTY_FORM);
  // Inline Category Creation Toggle
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  // Category Mutations
  const { mutateAsync: addCategory, isPending: isAddingCategory } = useAddCategory();
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } = useUpdateCategory();
  // Product Mutations
  const { mutateAsync: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct();

  // Populate Category Form On Edit
  useEffect(() => {
    if (editingCategory) setNewCategoryName(editingCategory.name || "");
  }, [editingCategory]);

  // Populate Product Form On Edit
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        price: editingProduct.price || "",
        prepTime: editingProduct.preparationTime || "",
        categoryId: editingProduct.category?._id || editingProduct.categoryId || "",
        description: editingProduct.description || "",
        image: null,
      });
    }
  }, [editingProduct]);

  // Add Category Submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await addCategory({ name: newCategoryName });
      setActiveAction("");
      setNewCategoryName("");
      setIsCreatingCategory(false);
    } catch (err) {
      console.error("Category add error:", err);
      alert("Kategori eklenemedi, lütfen tekrar deneyin.");
    }
  };

  // Edit Category Submit
  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    const categoryId = editingCategory?._id || editingCategory?.id;
    if (!categoryId) { alert("Kategori ID bulunamadı."); return; }
    try {
      await updateCategory({ id: categoryId, data: { name: newCategoryName || editingCategory.name } });
      setActiveAction("");
      setEditingCategory(null);
      setNewCategoryName("");
      setIsMenuModalOpen(false);
    } catch (err) {
      console.error("Category update error:", err);
      alert("Kategori güncellenemedi.");
    }
  };

  // Add Product Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    let finalCategoryId = formData.categoryId;
    try {
      if (isCreatingCategory && newCategoryName) {
        const res = await addCategory({ name: newCategoryName });
        finalCategoryId = res.data._id || res.data.id;
      }
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      if (formData.prepTime) data.append("prepTime", formData.prepTime);
      data.append("description", formData.description);
      data.append("categoryId", finalCategoryId);
      if (formData.image) data.append("image", formData.image);
      await addProduct(data);
      setActiveAction("");
      setFormData(EMPTY_FORM);
      setIsCreatingCategory(false);
      setNewCategoryName("");
      setIsMenuModalOpen(false);
    } catch (err) {
      console.error("Product add error:", err);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // Edit Product Submit
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingProduct._id,
      data: {
        name: formData.name || editingProduct.name,
        price: Number(formData.price !== "" ? formData.price : editingProduct.price),
        preparationTime: Number(formData.prepTime !== "" ? formData.prepTime : editingProduct.preparationTime),
        categoryId: formData.categoryId || editingProduct.category?._id || editingProduct.categoryId,
        description: formData.description || editingProduct.description,
      },
    };
    updateProduct(payload, {
      onSuccess: () => { setActiveAction(""); setEditingProduct(null); setFormData(EMPTY_FORM); setIsMenuModalOpen(false); },
      onError: (err) => { console.error("Product update error:", err); alert("Ürün güncellenirken bir sorun oluştu."); },
    });
  };

  // Close / Back Handler
  const handleClose = () => {
    if (activeAction) {
      setActiveAction("");
      setEditingCategory(null);
      setEditingProduct(null);
      setNewCategoryName("");
      setFormData(EMPTY_FORM);
    } else {
      setIsMenuModalOpen(false);
    }
  };

  // Shared Input Class
  const inputClass = "w-full p-4 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]";
  // Shared Label Class
  const labelClass = "pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400";
  // Shared Submit Button Class
  const submitClass = "w-full mt-auto py-[25.5px] rounded-2xl font-bold bg-[#1e293b] text-white hover:bg-[#334155] active:scale-[0.98]";

  return (
    <div className={`fixed top-26.25 right-0 z-30 flex flex-col overflow-y-auto w-full h-[calc(100dvh-105px)] gap-8 py-6 px-8 border-l border-[#dddddd] bg-[#f3f3f3] dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:w-100 lg:h-screen lg:translate-x-0 lg:py-10 ${isMenuModalOpen ? "translate-x-0" : "translate-x-full"}`}>
      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex flex-1 items-center justify-between h-14.5 p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold capitalize text-white">{activeAction ? activeAction.replace("-", " ") : "Menu Management"}</h2>
        </div>
        <button onClick={handleClose} className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-white active:scale-95 dark:bg-[#2d2d2d] ${!activeAction ? "md:hidden" : "md:flex"}`}>
          {activeAction
            ? <Icons.ChevronLeft size={24} className="text-[#a5b4fc]" />
            : <Icons.X size={24} className="text-[#121212] dark:text-white" />}
        </button>
      </div>

      <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

      {/* Add Category Form */}
      {activeAction === "add-category" && (
        <form className="flex flex-col flex-1 gap-3 h-full" onSubmit={handleCategorySubmit}>
          <div>
            <label className={labelClass}>Category Name</label>
            <input placeholder="e.g. Desserts" className={inputClass} required value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
          </div>
          <button type="submit" disabled={isAddingCategory} className={submitClass}>{isAddingCategory ? "SAVING..." : "SAVE CATEGORY"}</button>
        </form>
      )}

      {/* Edit Category Form */}
      {activeAction === "edit-category" && (
        <form className="flex flex-col flex-1 gap-3 h-full" onSubmit={handleEditCategorySubmit}>
          {!editingCategory ? (
            <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-indigo-500/5">
              <div className="p-4 mb-4 rounded-full bg-indigo-500/10"><Icons.MousePointerClick className="text-indigo-500" size={32} /></div>
              <h3 className="font-semibold text-indigo-600">Edit Category</h3>
              <p className="mt-1 max-w-50 text-xs text-indigo-500/60">Please select a category from the main view to edit its details.</p>
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>Edit Category Name</label>
                <input defaultValue={newCategoryName} placeholder="e.g. Desserts" className={inputClass} required onChange={(e) => setNewCategoryName(e.target.value)} />
              </div>
              <button type="submit" disabled={isUpdatingCategory} className={submitClass}>{isUpdatingCategory ? "UPDATING..." : "UPDATE CATEGORY"}</button>
            </>
          )}
        </form>
      )}

      {/* Delete Category Info */}
      {activeAction === "delete-category" && (
        <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-red-500/5">
          <div className="p-4 mb-4 rounded-full bg-red-500/10"><Icons.Trash2 className="text-red-500" size={32} /></div>
          <h3 className="font-semibold text-red-600">Delete Category</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">Select a category from the main view to permanently remove it.</p>
        </div>
      )}

      {/* Add Product Form */}
      {activeAction === "add-product" && (
        <form className="flex flex-col flex-1 gap-3 h-full" onSubmit={handleProductSubmit}>
          <div>
            <label className={labelClass}>Product Name</label>
            <input placeholder="e.g. Double Cheeseburger" className={inputClass} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price</label>
              <input type="number" placeholder="0.00" className={`${inputClass} text-center`} required onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Prep (Min)</label>
              <input type="number" placeholder="15" className={`${inputClass} text-center`} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            {!isCreatingCategory ? (
              <div className="relative">
                <select className="w-full p-4 pr-10 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none appearance-none cursor-pointer focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white" required value={formData.categoryId} onChange={(e) => e.target.value === "new" ? setIsCreatingCategory(true) : setFormData({ ...formData, categoryId: e.target.value })}>
                  <option value="">Select category</option>
                  {categories?.map((c) => <option key={c.id ?? c._id} value={c.id ?? c._id}>{c.name}</option>)}
                  <option value="new" className="font-bold text-indigo-500">+ Create New</option>
                </select>
                <Icons.ChevronDown className="absolute top-5 right-4 pointer-events-none text-gray-400" size={18} />
              </div>
            ) : (
              <div className="flex gap-3">
                <input placeholder="New Category Name" className="flex-1 p-4 rounded-2xl border border-indigo-500/30 bg-[#dddddd]/50 outline-none dark:bg-[#2d2d2d] dark:text-white" onChange={(e) => setNewCategoryName(e.target.value)} />
                <button type="button" onClick={() => setIsCreatingCategory(false)} className="flex items-center justify-center px-4 rounded-2xl text-[13px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 hover:bg-red-500/20">CANCEL</button>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea placeholder="A brief description of the product..." className="w-full h-24 p-4 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none resize-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          {/* Image Upload */}
          <label className="group block p-6 rounded-2xl border-2 border-dashed border-[#dddddd] text-center cursor-pointer hover:border-indigo-400/50 hover:bg-indigo-400/5 dark:border-[#2d2d2d]">
            <Icons.Upload className="mx-auto mb-2 text-gray-400 group-hover:text-indigo-400" />
            <p className="text-[11px] font-bold uppercase text-gray-400">{formData.image ? formData.image.name : "Upload Product Image"}</p>
            <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFormData({ ...formData, image: e.target.files[0] }); }} />
          </label>

          <button type="submit" disabled={isAddingProduct} className={submitClass}>{isAddingProduct ? "SAVING..." : "SAVE PRODUCT"}</button>
        </form>
      )}

      {/* Edit Product Form */}
      {activeAction === "edit-product" && (
        <form className="flex flex-col flex-1 gap-3 h-full" onSubmit={handleEditProductSubmit}>
          {!editingProduct ? (
            <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-indigo-500/5">
              <div className="p-4 mb-4 rounded-full bg-indigo-500/10"><Icons.MousePointerClick className="text-indigo-500" size={32} /></div>
              <h3 className="font-semibold text-indigo-600">Select a Product</h3>
              <p className="mt-1 max-w-50 text-xs text-indigo-500/60">Please select a product from the main board to edit its details.</p>
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>Edit Product Name</label>
                <input defaultValue={formData.name} placeholder="e.g. Double Cheeseburger" className={inputClass} required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Price</label>
                  <input type="number" defaultValue={formData.price} placeholder="0.00" className={`${inputClass} text-center`} required onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Prep (Min)</label>
                  <input type="number" defaultValue={formData.preparationTime} placeholder="15" className={`${inputClass} text-center`} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <div className="relative">
                  <select defaultValue={formData.categoryId} className="w-full p-4 pr-10 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none appearance-none cursor-pointer focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white" onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                    {categories?.map((c) => <option key={c.id ?? c._id} value={c.id ?? c._id}>{c.name}</option>)}
                  </select>
                  <Icons.ChevronDown className="absolute top-5 right-4 pointer-events-none text-gray-400" size={18} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea defaultValue={formData.description} placeholder="A brief description of the product..." className="w-full h-24 p-4 rounded-2xl border border-transparent bg-[#dddddd]/50 outline-none resize-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              {/* Image Upload */}
              <label className="group block p-6 rounded-2xl border-2 border-dashed border-[#dddddd] text-center cursor-pointer hover:border-indigo-400/50 hover:bg-indigo-400/5 dark:border-[#2d2d2d]">
                <Icons.Upload className="mx-auto mb-2 text-gray-400 group-hover:text-indigo-400" />
                <p className="text-[11px] font-bold uppercase text-gray-400">{formData.image ? formData.image.name : "Change Product Image (Optional)"}</p>
                <input type="file" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFormData({ ...formData, image: e.target.files[0] }); }} />
              </label>

              <button type="submit" disabled={isUpdatingProduct} className={submitClass}>{isUpdatingProduct ? "UPDATING..." : "UPDATE PRODUCT"}</button>
            </>
          )}
        </form>
      )}

      {/* Delete Product Info */}
      {activeAction === "delete-product" && (
        <div className="flex flex-col flex-1 items-center justify-center p-8 rounded-2xl text-center bg-red-500/5">
          <div className="p-4 mb-4 rounded-full bg-red-500/10"><Icons.Trash2 className="text-red-500" size={32} /></div>
          <h3 className="font-semibold text-red-600">Delete Product</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">Select a product from the main view to permanently remove it.</p>
        </div>
      )}

      {/* Summary Cards And Action Buttons */}
      {!activeAction && (
        <>
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Menu Summary</label>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
              {/* Categories Card */}
              <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
                <Icons.Layers size={24} className="text-[#495057] dark:text-[#868e96]" />
                <div>
                  <p className="text-[14px] font-bold leading-tight">Kategoriler</p>
                  <h4 className="text-[13px] font-bold opacity-40">{categories?.length || 0} adet</h4>
                </div>
              </div>

              {/* Products Card */}
              <div className="flex flex-col justify-between h-38 p-4 rounded-2xl bg-[#dddddd] dark:bg-[#2d2d2d] text-[#121212] dark:text-[#ffffff] md:p-5 lg:p-6">
                <Icons.Package size={24} className="text-[#495057] dark:text-[#868e96]" />
                <div>
                  <p className="text-[14px] font-bold leading-tight">Ürün Sayısı</p>
                  <h4 className="text-[13px] font-bold opacity-40">{products?.length || 0} adet</h4>
                </div>
              </div>

              {/* Stock Card */}
              <div className="col-span-2 flex flex-col justify-between h-38 w-full p-4 rounded-2xl bg-[#a5b4fc] md:p-5 lg:p-6">
                <Icons.AlertTriangle size={24} className="text-white" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[14px] font-bold leading-tight text-white">Stok Takibi</p>
                    <h4 className="text-[13px] font-bold opacity-70 text-white">{products?.filter((p) => p.stock < 5).length || 0} Kritik Ürün</h4>
                  </div>
                  <span className="text-[13px] font-bold opacity-70 text-white">{Math.round((products?.filter((p) => p.stock > 0).length / (products?.length || 1)) * 100)}% Doluluk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

          <div className="flex flex-col gap-8">
            {/* Management Actions */}
            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Management Actions</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveAction("add-category")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                  <Icons.FolderPlus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Category</span>
                </button>
                <button onClick={() => { setActiveAction("delete-category"); setIsMenuModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  <Icons.FolderMinus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Delete Category</span>
                </button>
                <button onClick={() => setActiveAction("add-product")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                  <Icons.Plus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Product</span>
                </button>
                <button onClick={() => { setActiveAction("delete-product"); setIsMenuModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20">
                  <Icons.Trash2 size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Delete Product</span>
                </button>
              </div>
            </div>

            <div className="w-full h-px shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* Editing Actions */}
            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Editing Actions</label>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setActiveAction("edit-category"); setIsMenuModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                  <Icons.FolderEdit size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Edit Category</span>
                </button>
                <button onClick={() => { setActiveAction("edit-product"); setIsMenuModalOpen(false); }} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#dddddd] text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400">
                  <Icons.Edit size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Edit Product</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}