import { useParams, Link, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProperty } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Pencil, ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id || "");
  const { user, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return <Navigate to="/properties" replace />;
  }

  const canEdit = user?.id === property.agent_id || isAdmin;
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Draft", variant: "secondary" },
    pending_approval: { label: "Pending Approval", variant: "outline" },
    active: { label: "Active", variant: "default" },
    sold: { label: "Sold", variant: "secondary" },
    rejected: { label: "Rejected", variant: "destructive" },
  };

  const statusInfo = statusConfig[property.status] || statusConfig.draft;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/properties">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Square className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <p className="text-2xl font-bold text-primary">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(property.price)}
              </p>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {property.address}
                {property.city && `, ${property.city}`}
                {property.state && `, ${property.state}`}
                {property.zip_code && ` ${property.zip_code}`}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {property.bedrooms !== null && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} beds</span>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} baths</span>
                </div>
              )}
              {property.square_footage && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.square_footage.toLocaleString()} sqft</span>
                </div>
              )}
            </div>

            {canEdit && (
              <Button asChild>
                <Link to={`/property/${property.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Property
                </Link>
              </Button>
            )}
          </div>
        </div>

        {property.description && (
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
            </CardContent>
          </Card>
        )}

        {property.status === "rejected" && property.rejection_reason && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.rejection_reason}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetail;

