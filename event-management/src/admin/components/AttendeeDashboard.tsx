import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Bookmark,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Heart,
  Share2,
  Download
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

interface AttendeeDashboardProps {
  user: User;
}

export const AttendeeDashboard = ({ user }: AttendeeDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API calls
  const stats = {
    totalEvents: 12,
    upcomingEvents: 3,
    completedEvents: 8,
    totalNetworking: 45,
    savedEvents: 5,
    totalPoints: 1250
  };

  const events = [
    {
      id: "1",
      title: "Tech Conference 2024",
      date: "2024-03-15",
      time: "09:00 AM",
      location: "Convention Center",
      status: "registered",
      category: "Technology",
      speakers: ["Dr. Smith", "Prof. Johnson"],
      rating: 4.8,
      isFavorite: true
    },
    {
      id: "2",
      title: "Startup Networking",
      date: "2024-03-20",
      time: "06:00 PM",
      location: "Business Hub",
      status: "upcoming",
      category: "Networking",
      speakers: ["Sarah Wilson", "Mike Chen"],
      rating: 0,
      isFavorite: false
    },
    {
      id: "3",
      title: "Industry Workshop",
      date: "2024-02-28",
      time: "10:00 AM",
      location: "Training Center",
      status: "completed",
      category: "Education",
      speakers: ["Dr. Brown", "Lisa Davis"],
      rating: 4.6,
      isFavorite: true
    }
  ];

  const networkingContacts = [
    { id: "1", name: "Alice Johnson", company: "Tech Corp", position: "CTO", event: "Tech Conference 2024", status: "connected" },
    { id: "2", name: "Bob Smith", company: "Startup Inc", position: "Founder", event: "Startup Networking", status: "pending" },
    { id: "3", name: "Carol Davis", company: "Innovation Labs", position: "Product Manager", event: "Industry Workshop", status: "connected" },
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
              <span className="text-blue-600">{stats.upcomingEvents}</span> upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Networking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNetworking}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+8</span> new connections
            </p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+150</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled soon</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully attended</p>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saved Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.savedEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Bookmarked for later</p>
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
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'registered' ? 'bg-green-100 text-green-800' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                    {event.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className={event.isFavorite ? "text-red-500" : ""}>
                      <Heart className={`h-4 w-4 ${event.isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
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
          <Calendar className="h-4 w-4 mr-2" />
          Browse Events
        </Button>
      </div>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>My Events</CardTitle>
          <CardDescription>Manage your event registrations and preferences</CardDescription>
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
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Speakers: {event.speakers.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'registered' ? 'bg-green-100 text-green-800' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                    {event.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{event.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className={event.isFavorite ? "text-red-500" : ""}>
                      <Heart className={`h-4 w-4 ${event.isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
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

  const renderNetworking = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Networking</h2>
      
      <Card className="bg-glass-effect border-0 shadow-medium">
        <CardHeader>
          <CardTitle>Recent Connections</CardTitle>
          <CardDescription>People you've met at events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {networkingContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.position} at {contact.company}</p>
                    <p className="text-xs text-primary font-medium">{contact.event}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Name</span>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Company</span>
                <span className="text-sm font-medium">{user.company || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Position</span>
                <span className="text-sm font-medium">{user.position || "Not specified"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-glass-effect border-0 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>Your event participation milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Events Attended</span>
                <span className="text-sm font-medium">{stats.completedEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Networking Score</span>
                <span className="text-sm font-medium">{stats.totalNetworking}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Loyalty Points</span>
                <span className="text-sm font-medium">{stats.totalPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="text-sm font-medium">2024</span>
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
              {user.position} at {user.company} • Event Attendee
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-background/50 rounded-lg p-1 mb-8">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "events", label: "Events", icon: Calendar },
          { id: "networking", label: "Networking", icon: Users },
          { id: "profile", label: "Profile", icon: Users }
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
      {activeTab === "networking" && renderNetworking()}
      {activeTab === "profile" && renderProfile()}
    </div>
  );
};
