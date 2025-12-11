import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useDeleteProperty } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MyProperties = () => {
  const { data: properties, isLoading } = useProperties({ myPropertiesOnly: true });
  const deleteProperty = useDeleteProperty();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <Button asChild>
            <Link to="/property/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {properties && properties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">No properties yet</p>
            <Button asChild>
              <Link to="/property/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Property
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;

