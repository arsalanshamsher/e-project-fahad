import React, { useState } from 'react';
import { Search, Filter, Check, X, Eye, Building2, Mail, Phone } from 'lucide-react';

const Exhibitors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const exhibitors = [
    {
      id: '1',
      company_name: 'Tech Innovators Inc.',
      contact_person: 'John Smith',
      contact_email: 'john@techinnovators.com',
      contact_phone: '+1 (555) 123-4567',
      booth_size_preference: 'large',
      booth_number: 'A-12',
      status: 'approved',
      application_date: '2024-01-15',
      event_title: 'Tech Innovation Expo 2024',
    },
    {
      id: '2',
      company_name: 'Digital Solutions Ltd.',
      contact_person: 'Sarah Johnson',
      contact_email: 'sarah@digitalsolutions.com',
      contact_phone: '+1 (555) 987-6543',
      booth_size_preference: 'medium',
      booth_number: null,
      status: 'pending',
      application_date: '2024-01-20',
      event_title: 'Tech Innovation Expo 2024',
    },
    {
      id: '3',
      company_name: 'Future Systems Corp.',
      contact_person: 'Mike Davis',
      contact_email: 'mike@futuresystems.com',
      contact_phone: '+1 (555) 456-7890',
      booth_size_preference: 'small',
      booth_number: null,
      status: 'rejected',
      application_date: '2024-01-18',
      event_title: 'Digital Marketing Summit',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBoothSizeColor = (size: string) => {
    switch (size) {
      case 'small':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-purple-100 text-purple-800';
      case 'large':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = exhibitor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibitor.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exhibitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    console.log('Approving exhibitor:', id);
    // Implement approval logic
  };

  const handleReject = (id: string) => {
    console.log('Rejecting exhibitor:', id);
    // Implement rejection logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exhibitors</h1>
          <p className="text-gray-600 mt-1">Manage exhibitor applications and booth assignments</p>
        </div>
        <div className="text-sm text-gray-600">
          {exhibitors.filter(e => e.status === 'pending').length} pending applications
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exhibitors..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Exhibitors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExhibitors.map((exhibitor) => (
                <tr key={exhibitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {exhibitor.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exhibitor.contact_person}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {exhibitor.contact_email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {exhibitor.contact_phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exhibitor.event_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBoothSizeColor(exhibitor.booth_size_preference)}`}>
                        {exhibitor.booth_size_preference}
                      </span>
                      {exhibitor.booth_number && (
                        <div className="text-sm text-gray-600">
                          Booth: {exhibitor.booth_number}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exhibitor.status)}`}>
                      {exhibitor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exhibitor.application_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      {exhibitor.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(exhibitor.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(exhibitor.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredExhibitors.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No exhibitors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Exhibitor applications will appear here when submitted'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Exhibitors;