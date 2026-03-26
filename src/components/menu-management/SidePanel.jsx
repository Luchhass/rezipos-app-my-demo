"use client";

import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { useCategories, useAddCategory, useUpdateCategory } from "@/hooks/useCategories";
import { useProducts, useAddProduct, useUpdateProduct } from "@/hooks/useProducts";

// Empty Form Data
const EMPTY_FORM = {
  name: "",
  price: "",
  prepTime: "",
  categoryId: "",
  description: "",
  image: null,
};

export default function MenuManagementSidePanel({
  isMenuModalOpen,
  setIsMenuModalOpen,
  activeAction,
  setActiveAction,
  editingCategory,
  setEditingCategory,
  editingProduct,
  setEditingProduct,
}) {
  // Category And Product Data
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts();

  // Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Category Mutations
  const { mutateAsync: addCategory, isPending: isAddingCategory } = useAddCategory();
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } = useUpdateCategory();

  // Product Mutations
  const { mutateAsync: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct();

  // Populate Category Form
  useEffect(() => {
    if (editingCategory) setNewCategoryName(editingCategory.name || "");
  }, [editingCategory]);

  // Populate Product Form
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
  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      await addCategory({ name: newCategoryName });
      setActiveAction("");
      setNewCategoryName("");
      setIsCreatingCategory(false);
    } catch (error) {
      console.error("Category add error:", error);
      alert("Kategori eklenemedi, lütfen tekrar deneyin.");
    }
  };

  // Edit Category Submit
  const handleEditCategorySubmit = async (event) => {
    event.preventDefault();

    const categoryId = editingCategory?._id || editingCategory?.id;
    if (!categoryId) {
      alert("Kategori ID bulunamadı.");
      return;
    }

    try {
      await updateCategory({
        id: categoryId,
        data: { name: newCategoryName || editingCategory.name },
      });

      setActiveAction("");
      setEditingCategory(null);
      setNewCategoryName("");
      setIsMenuModalOpen(false);
    } catch (error) {
      console.error("Category update error:", error);
      alert("Kategori güncellenemedi.");
    }
  };

  // Add Product Submit
  const handleProductSubmit = async (event) => {
    event.preventDefault();

    let finalCategoryId = formData.categoryId;

    try {
      if (isCreatingCategory && newCategoryName) {
        const response = await addCategory({ name: newCategoryName });
        finalCategoryId = response.data._id || response.data.id;
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
    } catch (error) {
      console.error("Product add error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  // Edit Product Submit
  const handleEditProductSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      id: editingProduct._id,
      data: {
        name: formData.name || editingProduct.name,
        price: Number(formData.price !== "" ? formData.price : editingProduct.price),
        preparationTime: Number(
          formData.prepTime !== "" ? formData.prepTime : editingProduct.preparationTime
        ),
        categoryId: formData.categoryId || editingProduct.category?._id || editingProduct.categoryId,
        description: formData.description || editingProduct.description,
      },
    };

    updateProduct(payload, {
      onSuccess: () => {
        setActiveAction("");
        setEditingProduct(null);
        setFormData(EMPTY_FORM);
        setIsMenuModalOpen(false);
      },
      onError: (error) => {
        console.error("Product update error:", error);
        alert("Ürün güncellenirken bir sorun oluştu.");
      },
    });
  };

  // Close Panel
  const handleClose = () => {
    if (activeAction) {
      setActiveAction("");
      setEditingCategory(null);
      setEditingProduct(null);
      setNewCategoryName("");
      setFormData(EMPTY_FORM);
      return;
    }

    setIsMenuModalOpen(false);
  };

  return (
    <div
      className={`fixed top-26.25 right-0 z-30 flex h-[calc(100dvh-105px)] w-full flex-col gap-8 overflow-y-auto border-l border-[#dddddd] bg-[#f3f3f3] px-8 py-6 dark:border-[#2d2d2d] dark:bg-[#111315] md:py-8 lg:top-0 lg:h-screen lg:w-100 lg:translate-x-0 lg:py-10 ${
        isMenuModalOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex h-14.5 flex-1 items-center justify-between rounded-2xl bg-[#a5b4fc] p-4 md:p-5 lg:p-6">
          <h2 className="text-[17.5px] font-bold capitalize text-white">
            {activeAction ? activeAction.replace("-", " ") : "Menu Management"}
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

      {/* Add Category Form */}
      {activeAction === "add-category" && (
        <form onSubmit={handleCategorySubmit} className="flex h-full flex-1 flex-col gap-3">
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Name</label>
            <input
              required
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="e.g. Desserts"
              className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
            />
          </div>

          <button
            type="submit"
            disabled={isAddingCategory}
            className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
          >
            {isAddingCategory ? "SAVING..." : "SAVE CATEGORY"}
          </button>
        </form>
      )}

      {/* Edit Category Form */}
      {activeAction === "edit-category" && (
        <form onSubmit={handleEditCategorySubmit} className="flex h-full flex-1 flex-col gap-3">
          {!editingCategory ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-indigo-500/5 p-8 text-center">
              <div className="mb-4 rounded-full bg-indigo-500/10 p-4">
                <Icons.MousePointerClick size={32} className="text-indigo-500" />
              </div>
              <h3 className="font-semibold text-indigo-600">Edit Category</h3>
              <p className="mt-1 max-w-50 text-xs text-indigo-500/60">
                Please select a category from the main view to edit its details.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Edit Category Name</label>
                <input
                  required
                  defaultValue={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="e.g. Desserts"
                  className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingCategory}
                className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
              >
                {isUpdatingCategory ? "UPDATING..." : "UPDATE CATEGORY"}
              </button>
            </>
          )}
        </form>
      )}

      {/* Delete Category Info */}
      {activeAction === "delete-category" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-red-500/5 p-8 text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-4">
            <Icons.Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="font-semibold text-red-600">Delete Category</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">
            Select a category from the main view to permanently remove it.
          </p>
        </div>
      )}

      {/* Add Product Form */}
      {activeAction === "add-product" && (
        <form onSubmit={handleProductSubmit} className="flex h-full flex-1 flex-col gap-3">
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product Name</label>
            <input
              required
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="e.g. Double Cheeseburger"
              className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</label>
              <input
                type="number"
                required
                onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                placeholder="0.00"
                className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 text-center outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
              />
            </div>

            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Prep (Min)</label>
              <input
                type="number"
                onChange={(event) => setFormData({ ...formData, prepTime: event.target.value })}
                placeholder="15"
                className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 text-center outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
              />
            </div>
          </div>

          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>

            {!isCreatingCategory ? (
              <div className="relative">
                <select
                  required
                  value={formData.categoryId}
                  onChange={(event) =>
                    event.target.value === "new"
                      ? setIsCreatingCategory(true)
                      : setFormData({ ...formData, categoryId: event.target.value })
                  }
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 pr-10 outline-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories?.map((category) => (
                    <option key={category.id ?? category._id} value={category.id ?? category._id}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new" className="font-bold text-indigo-500">
                    + Create New
                  </option>
                </select>

                <Icons.ChevronDown size={18} className="pointer-events-none absolute top-5 right-4 text-gray-400" />
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="New Category Name"
                  className="flex-1 rounded-2xl border border-indigo-500/30 bg-[#dddddd]/50 p-4 outline-none dark:bg-[#2d2d2d] dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(false)}
                  className="flex items-center justify-center rounded-2xl bg-red-500/10 px-4 text-[13px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/20"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
            <textarea
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="A brief description of the product..."
              className="h-24 w-full resize-none rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
            />
          </div>

          {/* Image Upload */}
          <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-[#dddddd] p-6 text-center hover:border-indigo-400/50 hover:bg-indigo-400/5 dark:border-[#2d2d2d]">
            <Icons.Upload className="mx-auto mb-2 text-gray-400 group-hover:text-indigo-400" />
            <p className="text-[11px] font-bold uppercase text-gray-400">
              {formData.image ? formData.image.name : "Upload Product Image"}
            </p>

            <input
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  setFormData({ ...formData, image: event.target.files[0] });
                }
              }}
            />
          </label>

          <button
            type="submit"
            disabled={isAddingProduct}
            className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
          >
            {isAddingProduct ? "SAVING..." : "SAVE PRODUCT"}
          </button>
        </form>
      )}

      {/* Edit Product Form */}
      {activeAction === "edit-product" && (
        <form onSubmit={handleEditProductSubmit} className="flex h-full flex-1 flex-col gap-3">
          {!editingProduct ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-indigo-500/5 p-8 text-center">
              <div className="mb-4 rounded-full bg-indigo-500/10 p-4">
                <Icons.MousePointerClick size={32} className="text-indigo-500" />
              </div>
              <h3 className="font-semibold text-indigo-600">Select a Product</h3>
              <p className="mt-1 max-w-50 text-xs text-indigo-500/60">
                Please select a product from the main board to edit its details.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Edit Product Name</label>
                <input
                  required
                  defaultValue={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="e.g. Double Cheeseburger"
                  className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</label>
                  <input
                    type="number"
                    required
                    defaultValue={formData.price}
                    onChange={(event) => setFormData({ ...formData, price: event.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 text-center outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
                  />
                </div>

                <div>
                  <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Prep (Min)</label>
                  <input
                    type="number"
                    defaultValue={formData.preparationTime}
                    onChange={(event) => setFormData({ ...formData, prepTime: event.target.value })}
                    placeholder="15"
                    className="w-full rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 text-center outline-none focus:border-indigo-400/30 focus:bg-[#dddddd] dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
                  />
                </div>
              </div>

              <div>
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>

                <div className="relative">
                  <select
                    defaultValue={formData.categoryId}
                    onChange={(event) => setFormData({ ...formData, categoryId: event.target.value })}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 pr-10 outline-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white"
                  >
                    {categories?.map((category) => (
                      <option key={category.id ?? category._id} value={category.id ?? category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <Icons.ChevronDown size={18} className="pointer-events-none absolute top-5 right-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                <textarea
                  defaultValue={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  placeholder="A brief description of the product..."
                  className="h-24 w-full resize-none rounded-2xl border border-transparent bg-[#dddddd]/50 p-4 outline-none focus:border-indigo-400/30 dark:bg-[#2d2d2d] dark:text-white dark:focus:bg-[#353535]"
                />
              </div>

              {/* Image Upload */}
              <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-[#dddddd] p-6 text-center hover:border-indigo-400/50 hover:bg-indigo-400/5 dark:border-[#2d2d2d]">
                <Icons.Upload className="mx-auto mb-2 text-gray-400 group-hover:text-indigo-400" />
                <p className="text-[11px] font-bold uppercase text-gray-400">
                  {formData.image ? formData.image.name : "Change Product Image (Optional)"}
                </p>

                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files?.[0]) {
                      setFormData({ ...formData, image: event.target.files[0] });
                    }
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={isUpdatingProduct}
                className="mt-auto w-full rounded-2xl bg-[#1e293b] py-[25.5px] font-bold text-white hover:bg-[#334155] active:scale-[0.98]"
              >
                {isUpdatingProduct ? "UPDATING..." : "UPDATE PRODUCT"}
              </button>
            </>
          )}
        </form>
      )}

      {/* Delete Product Info */}
      {activeAction === "delete-product" && (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-red-500/5 p-8 text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-4">
            <Icons.Trash2 size={32} className="text-red-500" />
          </div>
          <h3 className="font-semibold text-red-600">Delete Product</h3>
          <p className="mt-1 max-w-50 text-xs text-red-500/60">
            Select a product from the main view to permanently remove it.
          </p>
        </div>
      )}

      {/* Default Panel */}
      {!activeAction && (
        <>
          {/* Summary Cards */}
          <div>
            <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Menu Summary</label>

            <div className="grid w-full grid-cols-2 grid-rows-2 gap-3">
              {/* Categories Card */}
              <div className="flex h-38 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:p-5 lg:p-6">
                <Icons.Layers size={24} className="text-[#495057] dark:text-[#868e96]" />

                <div>
                  <p className="text-[14px] font-bold leading-tight">Kategoriler</p>
                  <h4 className="text-[13px] font-bold opacity-40">{categories?.length || 0} adet</h4>
                </div>
              </div>

              {/* Products Card */}
              <div className="flex h-38 flex-col justify-between rounded-2xl bg-[#dddddd] p-4 text-[#121212] dark:bg-[#2d2d2d] dark:text-white md:p-5 lg:p-6">
                <Icons.Package size={24} className="text-[#495057] dark:text-[#868e96]" />

                <div>
                  <p className="text-[14px] font-bold leading-tight">Ürün Sayısı</p>
                  <h4 className="text-[13px] font-bold opacity-40">{products?.length || 0} adet</h4>
                </div>
              </div>

              {/* Stock Card */}
              <div className="col-span-2 flex h-38 w-full flex-col justify-between rounded-2xl bg-[#a5b4fc] p-4 md:p-5 lg:p-6">
                <Icons.AlertTriangle size={24} className="text-white" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[14px] font-bold leading-tight text-white">Stok Takibi</p>
                    <h4 className="text-[13px] font-bold text-white opacity-70">
                      {products?.filter((product) => product.stock < 5).length || 0} Kritik Ürün
                    </h4>
                  </div>

                  <span className="text-[13px] font-bold text-white opacity-70">
                    {Math.round(
                      ((products?.filter((product) => product.stock > 0).length || 0) / (products?.length || 1)) * 100
                    )}
                    % Doluluk
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
            {/* Management Actions */}
            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Management Actions</label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveAction("add-category")}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
                >
                  <Icons.FolderPlus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Category</span>
                </button>

                <button
                  onClick={() => {
                    setActiveAction("delete-category");
                    setIsMenuModalOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 text-red-500 hover:bg-red-500/20"
                >
                  <Icons.FolderMinus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Delete Category</span>
                </button>

                <button
                  onClick={() => setActiveAction("add-product")}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
                >
                  <Icons.Plus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Add Product</span>
                </button>

                <button
                  onClick={() => {
                    setActiveAction("delete-product");
                    setIsMenuModalOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-4 text-red-500 hover:bg-red-500/20"
                >
                  <Icons.Trash2 size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Delete Product</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full shrink-0 bg-[#dddddd] dark:bg-[#2d2d2d]" />

            {/* Editing Actions */}
            <div>
              <label className="pl-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Editing Actions</label>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setActiveAction("edit-category");
                    setIsMenuModalOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
                >
                  <Icons.FolderEdit size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Edit Category</span>
                </button>

                <button
                  onClick={() => {
                    setActiveAction("edit-product");
                    setIsMenuModalOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#dddddd] p-4 text-gray-500 hover:opacity-80 dark:bg-[#2d2d2d] dark:text-gray-400"
                >
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