import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Settings, 
  Plus,
  UserPlus,
  CalendarPlus,
  Store,
  Activity,
  Shield,
  Eye,
  AlertCircle
} from "lucide-react";
import { useUsers, useExpos, useRealTimeData, useBooths } from "../../hooks/useDynamicData";
import { useQueryClient } from "@tanstack/react-query";
import { UserForm } from "../../components/forms/UserForm";
import { ExpoManagement } from "./ExpoManagement";
import { BoothForm } from "../../components/forms/BoothForm";
import { AnalyticsDashboard } from "../../components/analytics/AnalyticsDashboard";
import { userAPI, boothAPI } from "../../lib/api";
import { DataTable } from "../../components/tables/DataTable";
import { ExpoForm } from "../../components/forms/ExpoForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  company?: string;
  position?: string;
}

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showExpoForm, setShowExpoForm] = useState(false);
  const [showBoothForm, setShowBoothForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBoothId, setEditingBoothId] = useState<string | null>(null);

  // Get query client for cache invalidation
  const queryClient = useQueryClient();

  // Fetch real data using hooks
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: exposData, isLoading: exposLoading } = useExpos();
  const { data: realTimeData, isLoading: realTimeLoading } = useRealTimeData();
  const { data: boothsData, isLoading: boothsLoading } = useBooths();

  // Calculate real-time stats
  const stats = {
    totalUsers: usersData?.users?.length || 0,
    totalEvents: exposData?.expos?.length || 0,
    activeEvents: exposData?.expos?.filter((expo: any) => expo.status === 'active')?.length || 0,
    totalRevenue: exposData?.expos?.reduce((sum: number, expo: any) => sum + (expo.boothPrice * (expo.maxExhibitors || 0)), 0) || 0,
    growthRate: realTimeData?.systemStatus?.growthRate || 0,
    systemHealth: realTimeData?.systemStatus?.health || 99.8
  };

  const recentUsers = usersData?.users?.slice(0, 3) || [];
  const systemAlerts = realTimeData?.liveUpdates?.slice(0, 3) || [];

  // User management functions
  const handleAddUser = () => {
    setEditingId(null);
    setShowUserForm(true);
  };

  const handleEditUser = (id: string) => {
    setEditingId(id);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user:', id);
        
        // Call the delete API
        await userAPI.delete(id);
        
        // Show success message
        alert('User deleted successfully');
        
        // Refresh users data by invalidating the query
        queryClient.invalidateQueries({ queryKey: ['users'] });
        
      } catch (error) {
        console.error('Delete user error:', error);
        alert(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleUserFormSuccess = () => {
    setShowUserForm(false);
    setEditingId(null);
    // Refresh users data by invalidating the query
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleUserFormCancel = () => {
    setShowUserForm(false);
    setEditingId(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+{stats.growthRate}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-600">{stats.activeEvents}</span> currently active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.systemHealth}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">Optimal</span> performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Advanced analytics will be integrated here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              System Activity
            </CardTitle>
            <CardDescription>Real-time system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Activity monitor will be integrated here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              System Alerts
            </CardTitle>
            <CardDescription>Recent system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                  alert.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-400' :
                  'bg-green-50 border-l-4 border-green-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-400' :
                    alert.type === 'info' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {showUserForm ? (
        <UserForm
          userId={editingId || undefined}
          onSuccess={handleUserFormSuccess}
          onCancel={handleUserFormCancel}
        />
      ) : (
        <DataTable
          title="User Management"
          data={usersData?.users || []}
          columns={[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
            { key: 'company', label: 'Company', sortable: true },
            { key: 'status', label: 'Status', sortable: true },
            { key: 'createdAt', label: 'Created', sortable: true },
          ]}
          loading={usersLoading}
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          filters={[
            {
              key: 'role',
              label: 'Role',
              options: [
                { value: 'admin', label: 'Administrator' },
                { value: 'organizer', label: 'Organizer' },
                { value: 'exhibitor', label: 'Exhibitor' },
                { value: 'attendee', label: 'Attendee' },
              ],
            },
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ],
            },
          ]}
        />
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure system security parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Password Policy</span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Timeout</span>
                <Button variant="outline" size="sm">Set</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>System configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Schedule</span>
                <Button variant="outline" size="sm">Set</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintenance Mode</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">
              {user.position} at {user.company} • System Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-background/50 rounded-lg p-1 mb-8">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "users", label: "Users", icon: Users },
          { id: "expos", label: "Expos", icon: Calendar },
          { id: "booths", label: "Booths", icon: Store },
          { id: "settings", label: "Settings", icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "analytics" && <AnalyticsDashboard />}
      {activeTab === "users" && renderUsers()}
      {activeTab === "expos" && <ExpoManagement />}
      {activeTab === "booths" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Booth Management</h2>
          <Button onClick={() => setShowBoothForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Booth
          </Button>
          {showBoothForm ? (
            <BoothForm 
              boothId={editingBoothId || undefined}
              onSuccess={() => {
                setShowBoothForm(false);
                setEditingBoothId(null);
                queryClient.invalidateQueries({ queryKey: ['booths'] });
              }} 
              onCancel={() => {
                setShowBoothForm(false);
                setEditingBoothId(null);
              }} 
            />
          ) : (
            <DataTable
              title="Booths"
              data={boothsData?.booths || []}
              columns={[
                { key: 'name', label: 'Name', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
                { key: 'price', label: 'Price', sortable: true },
                { key: 'status', label: 'Status', sortable: true },
                { key: 'actions', label: 'Actions' }
              ]}
              loading={boothsLoading}
              onEdit={(id) => {
                setEditingBoothId(id);
                setShowBoothForm(true);
              }}
              onDelete={(id) => {
                if (confirm('Are you sure you want to delete this booth?')) {
                  boothAPI.delete(id).then(() => {
                    alert('Booth deleted successfully');
                    queryClient.invalidateQueries({ queryKey: ['booths'] });
                  }).catch(error => {
                    alert(`Failed to delete booth: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  });
                }
              }}
            />
          )}
        </div>
      )}
      {activeTab === "settings" && renderSettings()}
    </div>
  );
};
