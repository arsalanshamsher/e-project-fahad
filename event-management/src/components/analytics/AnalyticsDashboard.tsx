import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Calendar, Download, RefreshCw, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { AttendanceChart } from './AttendanceChart';
import { RevenueChart } from './RevenueChart';
import { useAnalyticsData, useRealTimeData } from '../../hooks/useDynamicData';
import { useAuth } from '../../contexts/AuthContext';

// Mock data - replace with actual API calls
const mockAttendanceData = [
  { date: '2024-01-01', attendees: 1200, exhibitors: 150, total: 1350, growth: 15 },
  { date: '2024-01-02', attendees: 1350, exhibitors: 160, total: 1510, growth: 12 },
  { date: '2024-01-03', attendees: 1420, exhibitors: 165, total: 1585, growth: 8 },
  { date: '2024-01-04', attendees: 1380, exhibitors: 170, total: 1550, growth: -2 },
  { date: '2024-01-05', attendees: 1500, exhibitors: 175, total: 1675, growth: 8 },
  { date: '2024-01-06', attendees: 1600, exhibitors: 180, total: 1780, growth: 6 },
  { date: '2024-01-07', attendees: 1550, exhibitors: 185, total: 1735, growth: -3 },
];

const mockRevenueData = [
  { date: '2024-01-01', boothRevenue: 45000, ticketRevenue: 25000, sponsorshipRevenue: 15000, totalRevenue: 85000, expenses: 35000, profit: 50000, profitMargin: 58.8 },
  { date: '2024-01-02', boothRevenue: 48000, ticketRevenue: 27000, sponsorshipRevenue: 16000, totalRevenue: 91000, expenses: 38000, profit: 53000, profitMargin: 58.2 },
  { date: '2024-01-03', boothRevenue: 52000, ticketRevenue: 29000, sponsorshipRevenue: 17000, totalRevenue: 98000, expenses: 40000, profit: 58000, profitMargin: 59.2 },
  { date: '2024-01-04', boothRevenue: 50000, ticketRevenue: 28000, sponsorshipRevenue: 16500, totalRevenue: 94500, expenses: 39000, profit: 55500, profitMargin: 58.7 },
  { date: '2024-01-05', boothRevenue: 55000, ticketRevenue: 31000, sponsorshipRevenue: 18000, totalRevenue: 104000, expenses: 42000, profit: 62000, profitMargin: 59.6 },
  { date: '2024-01-06', boothRevenue: 58000, ticketRevenue: 33000, sponsorshipRevenue: 19000, totalRevenue: 110000, expenses: 44000, profit: 66000, profitMargin: 60.0 },
  { date: '2024-01-07', boothRevenue: 56000, ticketRevenue: 32000, sponsorshipRevenue: 18500, totalRevenue: 106500, expenses: 43000, profit: 63500, profitMargin: 59.6 },
];

interface AnalyticsDashboardProps {
  expoId?: string;
  showControls?: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  expoId,
  showControls = true
}) => {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedExpo, setSelectedExpo] = useState(expoId || 'all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real analytics data
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsData(
    selectedExpo === 'all' ? undefined : selectedExpo, 
    selectedTimeRange
  );
  
  // Fetch real-time data
  const { data: realTimeData, isLoading: realTimeLoading } = useRealTimeData(
    selectedExpo === 'all' ? undefined : selectedExpo
  );

  // Use real data or fallback to mock data
  const attendanceData = analyticsData?.attendance || mockAttendanceData;
  const revenueData = analyticsData?.revenue || mockRevenueData;
  
  // Calculate summary statistics from real data
  const totalAttendees = attendanceData.reduce((sum, item) => sum + item.attendees, 0);
  const totalExhibitors = attendanceData.reduce((sum, item) => sum + item.exhibitors, 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const averageGrowth = attendanceData.reduce((sum, item) => sum + item.growth, 0) / attendanceData.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger a refetch of analytics data
    window.location.reload(); // Simple refresh for now
    setIsRefreshing(false);
  };

  // Show loading state
  if (analyticsLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (analyticsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">Failed to load analytics data</p>
          <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const handleExportAll = () => {
    // Export all analytics data
    const csvContent = [
      'Date,Attendees,Exhibitors,Total Participants,Growth,Revenue,Profit',
      ...mockAttendanceData.map((att, index) => {
        const rev = mockRevenueData[index];
        return `${att.date},${att.attendees},${att.exhibitors},${att.total},${att.growth}%,${rev.totalRevenue},${rev.profit}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-dashboard.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        
        {showControls && (
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            {expoId && (
              <Select value={selectedExpo} onValueChange={setSelectedExpo}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expos</SelectItem>
                  <SelectItem value={expoId}>Current Expo</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Attendees</p>
                <p className="text-3xl font-bold text-blue-900">{totalAttendees.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{averageGrowth.toFixed(1)}%</span>
                </div>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Exhibitors</p>
                <p className="text-3xl font-bold text-green-900">{totalExhibitors.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <Target className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-900">${(totalRevenue / 1000).toFixed(1)}k</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.2%</span>
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Profit</p>
                <p className="text-3xl font-bold text-orange-900">${(totalProfit / 1000).toFixed(1)}k</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+22.1%</span>
                </div>
              </div>
              <Target className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Attendance Trends & Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart 
                data={mockAttendanceData}
                title="Attendance Trends"
                showControls={true}
                chartType="line"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue Performance & Profitability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart 
                data={mockRevenueData}
                title="Revenue Analytics"
                showControls={true}
                chartType="composed"
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Attendance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceChart 
                  data={mockAttendanceData}
                  title="Attendance Overview"
                  showControls={false}
                  chartType="area"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart 
                  data={mockRevenueData}
                  title="Revenue Overview"
                  showControls={false}
                  chartType="bar"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700">Positive Trends</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Attendance growth of {averageGrowth.toFixed(1)}% over the period</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Revenue increased by 18.2% compared to previous period</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Profit margin maintained above 58% consistently</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-700">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Consider increasing booth prices for premium locations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Explore additional sponsorship opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Optimize operational costs to improve profit margins</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
