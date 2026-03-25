import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

// Fetch All Products
export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data),
  });

// Add Product
export const useAddProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => api.post("/products", formData),
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      qc.invalidateQueries(["categories"]);
    },
  });
};

// Update Product By Id
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      qc.invalidateQueries(["categories"]);
    },
  });
};

// Delete Product By Id
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["products"]);
      qc.invalidateQueries(["categories"]);
    },
  });
};