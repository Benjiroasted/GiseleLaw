import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ProcedureInput, type ProcedureResponse } from "@shared/routes";

// GET /api/procedures
export function useProcedures() {
  return useQuery({
    queryKey: [api.procedures.list.path],
    queryFn: async () => {
      const res = await fetch(api.procedures.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch procedures");
      return api.procedures.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/procedures/:id
export function useProcedure(id: number) {
  return useQuery({
    queryKey: [api.procedures.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.procedures.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch procedure");
      return api.procedures.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

// POST /api/procedures
export function useCreateProcedure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProcedureInput) => {
      const res = await fetch(api.procedures.create.path, {
        method: api.procedures.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.procedures.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create procedure");
      }
      return api.procedures.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.procedures.list.path] });
    },
  });
}

// PUT /api/procedures/:id
export function useUpdateProcedure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<ProcedureInput>) => {
      const url = buildUrl(api.procedures.update.path, { id });
      const res = await fetch(url, {
        method: api.procedures.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.procedures.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update procedure");
      }
      return api.procedures.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.procedures.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.procedures.get.path, data.id] });
    },
  });
}

// DELETE /api/procedures/:id
export function useDeleteProcedure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.procedures.delete.path, { id });
      const res = await fetch(url, { method: api.procedures.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete procedure");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.procedures.list.path] });
    },
  });
}
