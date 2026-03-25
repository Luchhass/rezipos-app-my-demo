import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

// Fetch All Areas
export const useAreas = () =>
  useQuery({
    queryKey: ["areas"],
    queryFn: () => api.get("/owner/areas").then((res) => res.data),
  });

// Add Area
export const useAddArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post("/owner/areas", data),
    onSuccess: () => qc.invalidateQueries(["areas"]),
  });
};

// Delete Area
export const useDeleteArea = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/owner/areas/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["areas"]);
      qc.invalidateQueries(["tables"]);
    },
  });
};