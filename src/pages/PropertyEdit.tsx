import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { useProperty, useCreateProperty, useUpdateProperty } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { Property } from "@/hooks/useProperties";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { data: property, isLoading } = useProperty(id || "");
  const { user } = useAuth();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  if (!isNew && isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isNew && !property) {
    return <Navigate to="/my-properties" replace />;
  }

  if (!isNew && property && user?.id !== property.agent_id) {
    return <Navigate to="/my-properties" replace />;
  }

  const handleSubmit = async (data: any) => {
    try {
      if (isNew) {
        const newProperty = await createProperty.mutateAsync({
          ...data,
          agent_id: user!.id,
          images: [],
        });
        navigate(`/property/${newProperty.id}`);
      } else {
        await updateProperty.mutateAsync({
          id: id!,
          ...data,
        });
        navigate(`/property/${id}`);
      }
    } catch (error) {
      // Error handling is done by the mutation hooks
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to={isNew ? "/my-properties" : `/property/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? "Create New Property" : "Edit Property"}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? "Add a new property listing" : "Update property information"}
          </p>
        </div>

        <PropertyForm
          property={property || null}
          onSubmit={handleSubmit}
          isLoading={createProperty.isPending || updateProperty.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default PropertyEdit;

