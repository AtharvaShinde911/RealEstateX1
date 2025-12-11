import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAccessLogs } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const AdminLogs = () => {
  const [search, setSearch] = useState("");
  const { data: logs, isLoading } = useAccessLogs({ search });

  if (isLoading) {
    return (
      <DashboardLayout requireAdmin>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Logs</h1>
          <p className="text-muted-foreground">View system access and activity logs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by action..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {logs && logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.profiles?.email || "Unknown user"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      {log.ip_address && (
                        <div className="text-xs text-muted-foreground">IP: {log.ip_address}</div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span
                        className={
                          log.outcome === "success"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {log.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No logs found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;

