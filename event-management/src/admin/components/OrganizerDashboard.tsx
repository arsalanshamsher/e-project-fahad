import { useState } from "react";
import { 
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
  TrendingUp
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

interface OrganizerDashboardProps {
  user: User;
}

export const OrganizerDashboard = ({ user }: OrganizerDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API calls
  const stats = {
    totalEvents: 8,
    activeEvents: 3,
    totalAttendees: 1250,
    totalRevenue: 45000,
    upcomingEvents: 2,
    completedEvents: 3
  };

  const events = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Convention Center",
      attendees: 450,
      status: "active",
      revenue: 25000
    },
    {
      id: "2",
      title: "Startup Networking",
      date: "2024-03-20",
      time: "06:00 PM",
      location: "Business Hub",
      attendees: 120,
      status: "upcoming",
      revenue: 8000
    },
    {
      id: "3",
      title: "Industry Workshop",
      date: "2024-02-28",
      time: "10:00 AM",
      location: "Training Center",
      attendees: 80,
      status: "completed",
      revenue: 12000
    }
  ];

  const recentRegistrations = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", event: "Tech Conference 2024", status: "confirmed" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", event: "Startup Networking", status: "pending" },
    { id: "3", name: "Carol Davis", email: "carol@example.com", event: "Tech Conference 2024", status: "confirmed" },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+12.5%</span> from last month
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
              <span className="text-green-600">+8.3%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently running</p>
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

      {/* Recent Events */}
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Events
          </CardTitle>
          <CardDescription>Your latest event activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{event.attendees} attendees</p>
                    <p className="text-sm text-muted-foreground">${event.revenue.toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
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

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage your events and registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.date} at {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{event.attendees} attendees</p>
                    <p className="text-sm text-muted-foreground">${event.revenue.toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
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

  const renderAttendees = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendee Management</h2>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest attendee registrations for your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRegistrations.map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {registration.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{registration.name}</p>
                    <p className="text-sm text-muted-foreground">{registration.email}</p>
                    <p className="text-xs text-primary font-medium">{registration.event}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    registration.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {registration.status}
                  </span>
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
      <h2 className="text-2xl font-bold">Event Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Attendance Trends
            </CardTitle>
            <CardDescription>Event attendance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Attendance chart will be integrated here</p>
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
            <CardDescription>Event revenue breakdown</CardDescription>
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
              {user.position} at {user.company} • Event Organizer
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-background/50 rounded-lg p-1 mb-8">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "events", label: "Events", icon: Calendar },
          { id: "attendees", label: "Attendees", icon: Users },
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
      {activeTab === "events" && renderEvents()}
      {activeTab === "attendees" && renderAttendees()}
      {activeTab === "analytics" && renderAnalytics()}
    </div>
  );
};
