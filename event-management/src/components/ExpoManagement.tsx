import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Building2, Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Expo {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  location: {
    venue: string;
    address: string;
    city: string;
    country: string;
  };
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  capacity: {
    maxAttendees: number;
    maxExhibitors: number;
    maxBooths: number;
  };
  pricing: {
    attendeePrice: number;
    exhibitorPrice: number;
  };
  statistics: {
    registeredAttendees: number;
    registeredExhibitors: number;
    boothOccupancy: number;
    totalRevenue: number;
  };
}

const ExpoManagement: React.FC = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState<Expo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingExpo, setEditingExpo] = useState<Expo | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    venue: '',
    address: '',
    city: '',
    country: '',
    maxAttendees: '',
    maxExhibitors: '',
    maxBooths: '',
    attendeePrice: '',
    exhibitorPrice: ''
  });

  useEffect(() => {
    fetchExpos();
  }, []);

  const fetchExpos = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockExpos: Expo[] = [
        {
          id: '1',
          title: 'Tech Expo 2024',
          description: 'Annual technology exhibition showcasing the latest innovations',
          theme: 'Innovation & Technology',
          startDate: '2024-06-15',
          endDate: '2024-06-17',
          location: {
            venue: 'Convention Center',
            address: '123 Main St',
            city: 'New York',
            country: 'USA'
          },
          status: 'published',
          capacity: {
            maxAttendees: 2000,
            maxExhibitors: 150,
            maxBooths: 200
          },
          pricing: {
            attendeePrice: 50,
            exhibitorPrice: 1500
          },
          statistics: {
            registeredAttendees: 1250,
            registeredExhibitors: 89,
            boothOccupancy: 75,
            totalRevenue: 125000
          }
        },
        {
          id: '2',
          title: 'Business Summit 2024',
          description: 'Global business leaders conference',
          theme: 'Leadership & Strategy',
          startDate: '2024-07-20',
          endDate: '2024-07-22',
          location: {
            venue: 'Grand Hotel',
            address: '456 Business Ave',
            city: 'London',
            country: 'UK'
          },
          status: 'draft',
          capacity: {
            maxAttendees: 1000,
            maxExhibitors: 80,
            maxBooths: 100
          },
          pricing: {
            attendeePrice: 100,
            exhibitorPrice: 2000
          },
          statistics: {
            registeredAttendees: 0,
            registeredExhibitors: 0,
            boothOccupancy: 0,
            totalRevenue: 0
          }
        }
      ];
      
      setExpos(mockExpos);
    } catch (error) {
      console.error('Error fetching expos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingExpo) {
        // Update existing expo
        await updateExpo(editingExpo.id);
      } else {
        // Create new expo
        await createExpo();
      }
      
      setIsCreateDialogOpen(false);
      setEditingExpo(null);
      resetForm();
      fetchExpos();
    } catch (error) {
      console.error('Error saving expo:', error);
    }
  };

  const createExpo = async () => {
    // Mock API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Creating expo:', formData);
  };

  const updateExpo = async (id: string) => {
    // Mock API call - replace with actual implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Updating expo:', id, formData);
  };

  const deleteExpo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expo?')) {
      try {
        // Mock API call - replace with actual implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExpos(prev => prev.filter(expo => expo.id !== id));
      } catch (error) {
        console.error('Error deleting expo:', error);
      }
    }
  };

  const editExpo = (expo: Expo) => {
    setEditingExpo(expo);
    setFormData({
      title: expo.title,
      description: expo.description,
      theme: expo.theme,
      startDate: expo.startDate,
      endDate: expo.endDate,
      venue: expo.location.venue,
      address: expo.location.address,
      city: expo.location.city,
      country: expo.location.country,
      maxAttendees: expo.capacity.maxAttendees.toString(),
      maxExhibitors: expo.capacity.maxExhibitors.toString(),
      maxBooths: expo.capacity.maxBooths.toString(),
      attendeePrice: expo.pricing.attendeePrice.toString(),
      exhibitorPrice: expo.pricing.exhibitorPrice.toString()
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      theme: '',
      startDate: '',
      endDate: '',
      venue: '',
      address: '',
      city: '',
      country: '',
      maxAttendees: '',
      maxExhibitors: '',
      maxBooths: '',
      attendeePrice: '',
      exhibitorPrice: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExpos = expos.filter(expo => {
    const matchesSearch = expo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expo.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expo.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Expo Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your expos, trade shows, and events
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingExpo(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Expo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExpo ? 'Edit Expo' : 'Create New Expo'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {editingExpo ? 'update' : 'create'} your expo
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="capacity">Capacity</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Expo Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter expo title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="theme">Theme *</Label>
                      <Input
                        id="theme"
                        value={formData.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        placeholder="Enter expo theme"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your expo"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                        placeholder="Enter venue name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter full address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="capacity" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="maxAttendees">Max Attendees</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxExhibitors">Max Exhibitors</Label>
                      <Input
                        id="maxExhibitors"
                        type="number"
                        value={formData.maxExhibitors}
                        onChange={(e) => handleInputChange('maxExhibitors', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBooths">Max Booths</Label>
                      <Input
                        id="maxBooths"
                        type="number"
                        value={formData.maxBooths}
                        onChange={(e) => handleInputChange('maxBooths', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="attendeePrice">Attendee Price ($)</Label>
                      <Input
                        id="attendeePrice"
                        type="number"
                        value={formData.attendeePrice}
                        onChange={(e) => handleInputChange('attendeePrice', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="exhibitorPrice">Exhibitor Price ($)</Label>
                      <Input
                        id="exhibitorPrice"
                        type="number"
                        value={formData.exhibitorPrice}
                        onChange={(e) => handleInputChange('exhibitorPrice', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingExpo(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExpo ? 'Update Expo' : 'Create Expo'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search expos by title, theme, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpos.map((expo) => (
          <Card key={expo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{expo.title}</CardTitle>
                  <CardDescription className="mt-2">{expo.theme}</CardDescription>
                </div>
                <Badge className={getStatusColor(expo.status)}>
                  {expo.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{expo.location.venue}, {expo.location.city}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Attendees:</span>
                  <span className="ml-2 font-medium">{expo.statistics.registeredAttendees.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Exhibitors:</span>
                  <span className="ml-2 font-medium">{expo.statistics.registeredExhibitors}</span>
                </div>
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <span className="ml-2 font-medium">${expo.statistics.totalRevenue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Booths:</span>
                  <span className="ml-2 font-medium">{expo.statistics.boothOccupancy}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => editExpo(expo)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteExpo(expo.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpos.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No expos found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first expo'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpoManagement;
