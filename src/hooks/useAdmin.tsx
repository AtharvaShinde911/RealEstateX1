import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

type AppRole = "admin" | "agent";

export interface UserWithRole {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  created_at: string;
}

export interface AccessLog {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  outcome: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

export function useUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at");

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const rolesMap = new Map(roles.map(r => [r.user_id, r.role]));

      return profiles.map(profile => ({
        ...profile,
        role: (rolesMap.get(profile.id) as AppRole) || "agent",
      })) as UserWithRole[];
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({ title: "User role updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating user role", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({ title: "User deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting user", description: error.message, variant: "destructive" });
    },
  });
}

export function useAccessLogs(filters: { search?: string; dateFrom?: string; dateTo?: string } = {}) {
  return useQuery({
    queryKey: ["admin", "logs", filters],
    queryFn: async () => {
      let query = supabase
        .from("access_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (filters.search) {
        query = query.or(`action.ilike.%${filters.search}%`);
      }

      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AccessLog[];
    },
  });
}

export function usePendingProperties() {
  return useQuery({
    queryKey: ["admin", "pending-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, profiles(full_name, email)")
        .eq("status", "pending_approval")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useApproveProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from("properties")
        .update({ status: "active", rejection_reason: null })
        .eq("id", propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property approved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error approving property", description: error.message, variant: "destructive" });
    },
  });
}

export function useRejectProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ propertyId, reason }: { propertyId: string; reason: string }) => {
      const { error } = await supabase
        .from("properties")
        .update({ status: "rejected", rejection_reason: reason })
        .eq("id", propertyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property rejected" });
    },
    onError: (error: Error) => {
      toast({ title: "Error rejecting property", description: error.message, variant: "destructive" });
    },
  });
}