import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Building2, MessageSquare, Bell, BarChart3, Plus, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalExpos: number;
  activeExpos: number;
  totalAttendees: number;
  totalExhibitors: number;
  totalRevenue: number;
  upcomingEvents: number;
}

interface RecentActivity {
  id: string;
  type: 'expo' | 'booth' | 'session' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalExpos: 0,
    activeExpos: 0,
    totalAttendees: 0,
    totalExhibitors: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data based on user role
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalExpos: 12,
        activeExpos: 3,
        totalAttendees: 1250,
        totalExhibitors: 89,
        totalRevenue: 125000,
        upcomingEvents: 5
      });

      setRecentActivity([
        {
          id: '1',
          type: 'expo',
          title: 'Tech Expo 2024',
          description: 'New expo created successfully',
          timestamp: '2 hours ago',
          status: 'success'
        },
        {
          id: '2',
          type: 'booth',
          title: 'Booth A1 Booked',
          description: 'Premium booth booked by TechCorp',
          timestamp: '4 hours ago',
          status: 'info'
        },
        {
          id: '3',
          type: 'session',
          title: 'AI Workshop',
          description: 'Session registration opened',
          timestamp: '6 hours ago',
          status: 'success'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expo': return <Building2 className="h-4 w-4" />;
      case 'booth': return <Users className="h-4 w-4" />;
      case 'session': return <Calendar className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'notification': return <Bell className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your events today
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExpos}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Expos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeExpos}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exhibitors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExhibitors}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Expo
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Attendees
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" />
                  Booth Management
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  Latest updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New booth booking</p>
                    <p className="text-xs text-gray-600">Booth A2 booked by TechCorp</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">2m ago</Badge>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session reminder</p>
                    <p className="text-xs text-gray-600">AI Workshop starts in 1 hour</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">1h ago</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events scheduled for the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Tech Expo {2024 + event}</h4>
                        <p className="text-sm text-gray-600">June {15 + event}, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Active</Badge>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Attendance Trends</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-medium">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Month</span>
                      <span className="font-medium">1,120</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Growth</span>
                      <span className="font-medium text-green-600">+11.6%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Revenue Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-medium">$125,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Booth Sales</span>
                      <span className="font-medium">$89,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ticket Sales</span>
                      <span className="font-medium">$36,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions and updates across the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
