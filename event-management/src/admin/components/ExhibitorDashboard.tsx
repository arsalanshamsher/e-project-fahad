import { useState } from "react";
import { 
  Store, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  BarChart3, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Mock data - replace with actual API calls
  const stats = {
    totalBooths: 5,
    activeBooths: 3,
    totalVisitors: 850,
    totalRevenue: 32000,
    upcomingEvents: 2,
    completedEvents: 2
  };

  const booths = [
    {
      id: "1",
      name: "Tech Innovation Hub",
      event: "Tech Conference 2024",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Hall A, Booth 12",
      visitors: 250,
      status: "active",
      revenue: 15000,
      rating: 4.8
    },
    {
      id: "2",
      name: "Startup Showcase",
      event: "Startup Networking",
      date: "2024-03-20",
      time: "06:00 PM",
      location: "Main Hall, Booth 8",
      visitors: 120,
      status: "upcoming",
      revenue: 8000,
      rating: 0
    },
    {
      id: "3",
      name: "Industry Solutions",
      event: "Industry Workshop",
      date: "2024-02-28",
      time: "10:00 AM",
      location: "Exhibition Center, Booth 15",
      visitors: 180,
      status: "completed",
      revenue: 9000,
      rating: 4.6
    }
  ];

  const recentVisitors = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", company: "Tech Corp", booth: "Tech Innovation Hub", time: "2 hours ago" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", company: "Startup Inc", booth: "Tech Innovation Hub", time: "3 hours ago" },
    { id: "3", name: "Carol Davis", email: "carol@example.com", company: "Innovation Labs", booth: "Tech Innovation Hub", time: "4 hours ago" },
  ];

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
          <div className="space-y-4">
            {booths.map((booth) => (
              <div key={booth.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{booth.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booth.date} at {booth.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booth.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{booth.visitors} visitors</p>
                    <p className="text-sm text-muted-foreground">${booth.revenue.toLocaleString()}</p>
                    {booth.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{booth.rating}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booth.status === 'active' ? 'bg-green-100 text-green-800' :
                    booth.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booth.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBooths = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booth Management</h2>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Book New Booth
        </Button>
      </div>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>All Booths</CardTitle>
          <CardDescription>Manage your exhibition booths and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {booths.map((booth) => (
              <div key={booth.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{booth.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booth.date} at {booth.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booth.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{booth.visitors} visitors</p>
                    <p className="text-sm text-muted-foreground">${booth.revenue.toLocaleString()}</p>
                    {booth.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{booth.rating}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booth.status === 'active' ? 'bg-green-100 text-green-800' :
                    booth.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booth.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
          <div className="space-y-3">
            {recentVisitors.map((visitor) => (
              <div key={visitor.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {visitor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{visitor.name}</p>
                    <p className="text-sm text-muted-foreground">{visitor.email}</p>
                    <p className="text-xs text-primary font-medium">{visitor.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{visitor.booth}</span>
                  <span className="text-xs text-muted-foreground">{visitor.time}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
