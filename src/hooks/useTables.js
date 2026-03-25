import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

// Fetch All Tables
export const useTables = (areaId = null) =>
  useQuery({
    queryKey: ["tables", areaId],
    queryFn: () => {
      const url = areaId ? `/owner/tables?areaId=${areaId}` : "/owner/tables";
      return api.get(url).then((res) => res.data);
    },
  });

// Add Tables To Area
export const useAddTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ areaId, count = 1 }) => api.post("/owner/tables", { areaId, count }),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Update Table By Id
export const useUpdateTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/owner/tables/${id}`, data),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Delete Table By Id
export const useDeleteTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/owner/tables/${id}`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Add Order Item To Table
export const useAddOrderToTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, productId, quantity }) => api.post(`/owner/tables/${tableId}/orders`, { productId, quantity }),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Delete Order Item From Table
export const useDeleteOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, orderId }) => api.delete(`/owner/tables/${tableId}/orders/${orderId}`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Update Order Item Quantity
export const useUpdateOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tableId, orderId, quantity }) => api.patch(`/owner/tables/${tableId}/orders/${orderId}`, { quantity }),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Send Order To Kitchen
export const useSendOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tableId) => api.post(`/owner/tables/${tableId}/send`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Reset Table Orders
export const useResetTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tableId) => api.post(`/owner/tables/${tableId}/reset`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Pay Table
export const usePayTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tableId) => api.post(`/owner/tables/${tableId}/pay`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};

// Clear Table Orders
export const useClearTable = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tableId) => api.post(`/owner/tables/${tableId}/clear`),
    onSuccess: () => qc.invalidateQueries(["tables"]),
  });
};