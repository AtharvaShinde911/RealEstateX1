import { Property, PropertyStatus } from "@/hooks/useProperties";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Square, Eye, Pencil, Trash2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<PropertyStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  pending_approval: { label: "Pending", variant: "outline" },
  active: { label: "Active", variant: "default" },
  sold: { label: "Sold", variant: "secondary" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const { user, isAdmin } = useAuth();
  const canEdit = user?.id === property.agent_id || isAdmin;
  const canDelete = (user?.id === property.agent_id && property.status === "draft") || isAdmin;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusInfo = statusConfig[property.status];

  return (
    <Card className="group overflow-hidden shadow-card transition-all hover:shadow-elevation-2">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Square className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <Badge 
          variant={statusInfo.variant}
          className="absolute left-3 top-3"
        >
          {statusInfo.label}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
            {property.title}
          </h3>
          <span className="shrink-0 text-lg font-bold text-primary">
            {formatPrice(property.price)}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {property.address}
            {property.city && `, ${property.city}`}
            {property.state && `, ${property.state}`}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
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

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/property/${property.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          {canEdit && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/property/${property.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(property.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}