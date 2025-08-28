import React, { useState } from 'react';
import { Plus, Search, Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';

const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual data from Supabase
  const events = [
    {
      id: '1',
      title: 'Tech Innovation Expo 2024',
      description: 'Latest technology trends and innovations',
      start_date: '2024-03-15',
      end_date: '2024-03-17',
      location: 'San Francisco Convention Center',
      status: 'published',
      max_exhibitors: 100,
      registered_exhibitors: 67,
    },
    {
      id: '2',
      title: 'Digital Marketing Summit',
      description: 'Marketing strategies for the digital age',
      start_date: '2024-04-20',
      end_date: '2024-04-21',
      location: 'Los Angeles Convention Center',
      status: 'draft',
      max_exhibitors: 50,
      registered_exhibitors: 12,
    },
    {
      id: '3',
      title: 'Healthcare Innovation Fair',
      description: 'Revolutionary healthcare technologies',
      start_date: '2024-02-10',
      end_date: '2024-02-12',
      location: 'Boston Medical Center',
      status: 'completed',
      max_exhibitors: 75,
      registered_exhibitors: 75,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Manage your expo events and exhibitions</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Event Banner Placeholder */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {event.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {event.registered_exhibitors}/{event.max_exhibitors} exhibitors
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Exhibitor Registration</span>
                  <span>{Math.round((event.registered_exhibitors / event.max_exhibitors) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(event.registered_exhibitors / event.max_exhibitors) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first event'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;