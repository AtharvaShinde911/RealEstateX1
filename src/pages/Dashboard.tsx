import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { Building2, ClipboardList, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { data: properties, isLoading } = useProperties({ myPropertiesOnly: true });

  const stats = [
    {
      title: "My Properties",
      value: properties?.length || 0,
      icon: Building2,
      link: "/my-properties",
      description: "Total properties you've created",
    },
    {
      title: "Active Properties",
      value: properties?.filter((p) => p.status === "active").length || 0,
      icon: ClipboardList,
      link: "/properties",
      description: "Properties currently active",
    },
    {
      title: "Pending Approval",
      value: properties?.filter((p) => p.status === "pending_approval").length || 0,
      icon: Shield,
      link: "/my-properties",
      description: "Awaiting admin review",
    },
  ];

  if (isAdmin) {
    stats.push({
      title: "All Users",
      value: 0,
      icon: Users,
      link: "/admin/users",
      description: "Manage system users",
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <Button asChild variant="link" className="p-0 mt-2 h-auto">
                    <Link to={stat.link}>View details →</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link to="/my-properties">View My Properties</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/properties">Browse All Properties</Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin/approvals">Review Pending Properties</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

