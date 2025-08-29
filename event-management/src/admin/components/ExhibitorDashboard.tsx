import { useState } from "react";
import { 
  Store, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  BarChart3, 
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBooths, useExpos } from "../../hooks/useDynamicData";
import { DataTable } from "../../components/tables/DataTable";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  company?: string;
  position?: string;
}

interface ExhibitorDashboardProps {
  user: User;
}

export const ExhibitorDashboard = ({ user }: ExhibitorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);

  // Fetch real data using hooks
  const { data: boothsData, isLoading: boothsLoading } = useBooths();
  const { data: exposData, isLoading: exposLoading } = useExpos();

  // Calculate real-time stats from actual data
  const booths = boothsData?.booths || [];
  const expos = exposData?.expos || [];
  
  const stats = {
    totalBooths: booths.length,
    activeBooths: booths.filter((booth: any) => booth.status === 'active').length,
    totalVisitors: booths.reduce((sum: number, booth: any) => sum + (booth.visitors || 0), 0),
    totalRevenue: booths.reduce((sum: number, booth: any) => sum + (booth.price || 0), 0),
    upcomingEvents: expos.filter((expo: any) => expo.status === 'upcoming').length,
    completedEvents: expos.filter((expo: any) => expo.status === 'completed').length
  };

  // Booth viewing function only
  const handleViewBooth = (id: string) => {
    setSelectedBoothId(id);
    // You can implement a modal or navigate to booth details
    console.log('Viewing booth:', id);
  };

  const handleBoothFormSuccess = () => {
    // This function is no longer needed since exhibitors can't create/edit booths
  };

  const handleBoothFormCancel = () => {
    // This function is no longer needed since exhibitors can't create/edit booths
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Booths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooths}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-blue-600">{stats.activeBooths}</span> currently active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+15.2%</span> from last month
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
              <span className="text-green-600">+12.8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booth Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Booths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.activeBooths}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently exhibiting</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled soon</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Booths */}
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Recent Booths
          </CardTitle>
          <CardDescription>Your latest exhibition activities</CardDescription>
        </CardHeader>
        <CardContent>
          {boothsLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : booths.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Store className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>No booths found. Start by booking your first booth!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {booths.slice(0, 3).map((booth: any) => (
                <div key={booth.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{booth.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booth.location || 'Location TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {booth.type || 'Standard'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${booth.price?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-muted-foreground">{booth.capacity || '0'} capacity</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booth.status === 'active' ? 'bg-green-100 text-green-800' :
                      booth.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                      booth.status === 'available' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {booth.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewBooth(booth.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderBooths = () => (
    <div className="space-y-6">
      {/* Booth viewing function only */}
      {selectedBoothId ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Booth Details</h2>
          <Card className="bg-glass-effect border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Booth: {booths.find(b => b.id === selectedBoothId)?.name || 'Loading...'}
              </CardTitle>
              <CardDescription>Detailed information about the selected booth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {booths.find(b => b.id === selectedBoothId)?.name || 'N/A'}</p>
                  <p><strong>Type:</strong> {booths.find(b => b.id === selectedBoothId)?.type || 'N/A'}</p>
                  <p><strong>Location:</strong> {booths.find(b => b.id === selectedBoothId)?.location || 'N/A'}</p>
                  <p><strong>Price:</strong> ${booths.find(b => b.id === selectedBoothId)?.price?.toLocaleString() || '0'}</p>
                  <p><strong>Capacity:</strong> {booths.find(b => b.id === selectedBoothId)?.capacity || '0'}</p>
                  <p><strong>Status:</strong> {booths.find(b => b.id === selectedBoothId)?.status || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>Created At:</strong> {booths.find(b => b.id === selectedBoothId)?.createdAt || 'N/A'}</p>
                  <p><strong>Updated At:</strong> {booths.find(b => b.id === selectedBoothId)?.updatedAt || 'N/A'}</p>
                  <p><strong>Exhibitor:</strong> {booths.find(b => b.id === selectedBoothId)?.exhibitor?.name || 'N/A'}</p>
                  <p><strong>Expo:</strong> {booths.find(b => b.id === selectedBoothId)?.expo?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedBoothId(null)}>Back to List</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Booth Management</h2>
            {/* No action buttons for exhibitors */}
          </div>
          
          <DataTable
            title="Available Booths"
            data={booths}
            columns={[
              { key: 'name', label: 'Booth Name', sortable: true },
              { key: 'type', label: 'Type', sortable: true },
              { key: 'location', label: 'Location', sortable: true },
              { key: 'price', label: 'Price', sortable: true },
              { key: 'maxCapacity', label: 'Capacity', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'actions', label: 'Actions' }
            ]}
            loading={boothsLoading}
            onAdd={() => {}} // No add action for exhibitors
            onEdit={() => {}} // No edit action for exhibitors
            onDelete={() => {}} // No delete action for exhibitors
            onView={handleViewBooth}
            showActions={false} // Hide action buttons for exhibitors
            filters={[
              {
                key: 'status',
                label: 'Status',
                options: [
                  { value: 'available', label: 'Available' },
                  { value: 'reserved', label: 'Reserved' },
                  { value: 'occupied', label: 'Occupied' },
                  { value: 'maintenance', label: 'Maintenance' },
                ],
              },
              {
                key: 'type',
                label: 'Type',
                options: [
                  { value: 'standard', label: 'Standard' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'vip', label: 'VIP' },
                  { value: 'corner', label: 'Corner' },
                  { value: 'island', label: 'Island' },
                ],
              },
            ]}
          />
        </>
      )}
    </div>
  );

  const renderVisitors = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visitor Management</h2>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
          <CardDescription>Latest booth visitors and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Visitor tracking will be integrated here</p>
            <p className="text-sm">This feature will show booth visitors and interactions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Booth Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Visitor Trends
            </CardTitle>
            <CardDescription>Booth visitor patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Visitor trends chart will be integrated here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue Analysis
            </CardTitle>
            <CardDescription>Booth revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Revenue chart will be integrated here</p>
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
              {user.position} at {user.company} • Exhibition Partner
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-background/50 rounded-lg p-1 mb-8">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "booths", label: "Booths", icon: Store },
          { id: "visitors", label: "Visitors", icon: Users },
          { id: "analytics", label: "Analytics", icon: TrendingUp }
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
      {activeTab === "booths" && renderBooths()}
      {activeTab === "visitors" && renderVisitors()}
      {activeTab === "analytics" && renderAnalytics()}
    </div>
  );
};
