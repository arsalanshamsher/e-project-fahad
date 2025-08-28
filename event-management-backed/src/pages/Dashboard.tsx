import React from 'react';
import { Calendar, Users, Building2, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for charts
  const registrationData = [
    { name: 'Jan', registrations: 120 },
    { name: 'Feb', registrations: 190 },
    { name: 'Mar', registrations: 150 },
    { name: 'Apr', registrations: 280 },
    { name: 'May', registrations: 350 },
    { name: 'Jun', registrations: 420 },
  ];

  const eventTypeData = [
    { name: 'Tech Expo', value: 45 },
    { name: 'Trade Show', value: 30 },
    { name: 'Conference', value: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={24}
          change="+12% from last month"
          changeType="positive"
          icon={Calendar}
        />
        <StatCard
          title="Active Exhibitors"
          value={156}
          change="+8% from last month"
          changeType="positive"
          icon={Building2}
        />
        <StatCard
          title="Total Attendees"
          value="2,847"
          change="+23% from last month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Revenue"
          value="$45,320"
          change="+15% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Types */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New exhibitor registered for Tech Expo 2024', time: '2 minutes ago', type: 'success' },
              { action: 'Event "Digital Marketing Summit" published', time: '1 hour ago', type: 'info' },
              { action: 'Exhibitor application pending review', time: '3 hours ago', type: 'warning' },
              { action: 'Payment received for booth booking', time: '1 day ago', type: 'success' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;