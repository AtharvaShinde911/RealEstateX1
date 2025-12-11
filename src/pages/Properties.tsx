import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { useProperties, PropertyFilters as PropertyFiltersType } from "@/hooks/useProperties";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const { data: properties, isLoading } = useProperties(filters);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Properties</h1>
          <p className="text-muted-foreground">Browse all active property listings</p>
        </div>

        <PropertyFilters filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground">No properties found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;

