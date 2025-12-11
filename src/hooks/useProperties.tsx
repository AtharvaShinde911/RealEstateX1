import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export type PropertyStatus = "draft" | "pending_approval" | "active" | "sold" | "rejected";
export type PropertyType = "house" | "apartment" | "condo" | "townhouse" | "land" | "commercial";

export interface Property {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  price: number;
  property_type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  square_footage: number | null;
  lot_size: number | null;
  status: PropertyStatus;
  images: string[];
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

export interface PropertyFilters {
  search?: string;
  status?: PropertyStatus | "all";
  propertyType?: PropertyType | "all";
  minPrice?: number;
  maxPrice?: number;
  myPropertiesOnly?: boolean;
}

export function useProperties(filters: PropertyFilters = {}) {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ["properties", filters, user?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.myPropertiesOnly && user) {
        query = query.eq("agent_id", user.id);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.propertyType && filters.propertyType !== "all") {
        query = query.eq("property_type", filters.propertyType);
      }

      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Property[];
    },
    enabled: !!user,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Property | null;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (property: Omit<Property, "id" | "created_at" | "updated_at" | "profiles">) => {
      const { data, error } = await supabase
        .from("properties")
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating property", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Property> & { id: string }) => {
      const { data, error } = await supabase
        .from("properties")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating property", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting property", description: error.message, variant: "destructive" });
    },
  });
}