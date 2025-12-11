import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePendingProperties, useApproveProperty, useRejectProperty } from "@/hooks/useAdmin";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Loader2, Check, X } from "lucide-react";

const AdminApprovals = () => {
  const { data: pendingProperties, isLoading } = usePendingProperties();
  const approveProperty = useApproveProperty();
  const rejectProperty = useRejectProperty();
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <DashboardLayout requireAdmin>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const handleApprove = (propertyId: string) => {
    approveProperty.mutate(propertyId);
  };

  const handleReject = () => {
    if (selectedPropertyId && rejectReason.trim()) {
      rejectProperty.mutate({ propertyId: selectedPropertyId, reason: rejectReason });
      setRejectReason("");
      setSelectedPropertyId(null);
    }
  };

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending property listings</p>
        </div>

        {pendingProperties && pendingProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingProperties.map((property) => (
              <Card key={property.id} className="relative">
                <PropertyCard property={property} />
                <div className="p-4 border-t flex gap-2">
                  <Button
                    onClick={() => handleApprove(property.id)}
                    disabled={approveProperty.isPending}
                    className="flex-1"
                  >
                    {approveProperty.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={() => setSelectedPropertyId(property.id)}
                        className="flex-1"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Property</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejecting this property listing.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">Rejection Reason</Label>
                          <Textarea
                            id="reason"
                            placeholder="Enter reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={handleReject}
                          disabled={!rejectReason.trim() || rejectProperty.isPending}
                        >
                          {rejectProperty.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Reject Property
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">All properties have been reviewed.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminApprovals;

