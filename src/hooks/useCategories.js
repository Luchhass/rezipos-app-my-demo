import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

// Fetch All Categories
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/owner/categories").then((res) => res.data),
  });

// Add Category
export const useAddCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/owner/categories", data),
    onSuccess: () => qc.invalidateQueries(["categories"]),
  });
};

// Update Category By Id
export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/owner/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries(["categories"]),
  });
};

// Delete Category And Related Products
export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      // Delete Related Products From Cache First
      const products = qc.getQueryData(["products"]) || [];
      const categoryProducts = products.filter((p) => {
        const catId = typeof p.categoryId === "object" ? p.categoryId?._id : p.categoryId;
        return catId === id;
      });
      for (const product of categoryProducts) {
        await api.delete(`/products/${product._id}`);
      }
      return api.delete(`/owner/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries(["categories"]);
      qc.invalidateQueries(["products"]);
    },
  });
};