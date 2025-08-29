import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Store, MapPin, Users, DollarSign, Ruler } from 'lucide-react';
import { useCreateBooth, useUpdateBooth, useBooth, useExpos } from '../../hooks/useDynamicData';
import { useAuth } from '../../contexts/AuthContext';

const boothSchema = z.object({
  name: z.string().min(3, 'Booth name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['standard', 'premium', 'vip', 'corner', 'island']),
  size: z.string().min(1, 'Size is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  maxCapacity: z.number().min(1, 'Maximum capacity must be at least 1'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  status: z.enum(['available', 'reserved', 'occupied', 'maintenance']),
  expoId: z.string().min(1, 'Expo is required'),
  location: z.string().min(1, 'Location is required'),
});

type BoothFormData = z.infer<typeof boothSchema>;

interface BoothFormProps {
  boothId?: string;
  expoId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BoothForm: React.FC<BoothFormProps> = ({ boothId, expoId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!boothId;

  // Fetch existing booth data if editing
  const { data: existingBooth, isLoading: isLoadingBooth } = useBooth(boothId || '');
  
  // Fetch available expos
  const { data: exposData, isLoading: isLoadingExpos, error: exposError } = useExpos({ status: 'active' });
  
  // Debug: Log the expos data (remove this in production)
  useEffect(() => {
    if (exposData) {
      console.log('Expos loaded:', exposData.expos?.length || 0, 'expos');
    }
  }, [exposData]);
  
  // Mutations
  const createBooth = useCreateBooth();
  const updateBooth = useUpdateBooth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<BoothFormData>({
    resolver: zodResolver(boothSchema),
    mode: 'onChange',
    defaultValues: {
      expoId: expoId || '',
      amenities: [],
      status: 'available',
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingBooth && isEditing) {
      Object.keys(existingBooth).forEach((key) => {
        if (key in boothSchema.shape) {
          // Map backend fields to frontend fields
          if (key === 'expo') {
            setValue('expoId', existingBooth[key]);
          } else {
            setValue(key as keyof BoothFormData, existingBooth[key]);
          }
        }
      });
    }
  }, [existingBooth, isEditing, setValue]);

  // Set expoId if provided
  useEffect(() => {
    if (expoId) {
      setValue('expoId', expoId);
    }
  }, [expoId, setValue]);

  const onSubmit = async (data: BoothFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateBooth.mutateAsync({ id: boothId, data });
      } else {
        await createBooth.mutateAsync({
          ...data,
          createdBy: user.id,
          createdAt: new Date().toISOString(),
        });
      }
      
      onSuccess?.();
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error('Failed to save booth:', error);
      alert(`Failed to save booth: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = watch('amenities') || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    setValue('amenities', newAmenities);
  };

  if (isLoadingBooth) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const availableAmenities = [
    'Electricity', 'Internet', 'Furniture', 'Storage', 'Security',
    'Cleaning', 'Catering', 'Audio/Visual', 'Parking', 'Accessibility'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          {isEditing ? 'Edit Booth' : 'Create New Booth'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Booth Name *</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter booth name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Booth Type *</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="corner">Corner</SelectItem>
                      <SelectItem value="island">Island</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Describe the booth features..."
                  rows={3}
                  className={errors.description ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Expo Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Expo *</label>
            {isLoadingExpos ? (
              <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading expos...</span>
              </div>
            ) : exposError ? (
              <div className="p-3 border border-red-200 rounded-md bg-red-50">
                <span className="text-sm text-red-600">Failed to load expos: {exposError.message}</span>
              </div>
            ) : exposData?.expos?.length === 0 ? (
              <div className="p-3 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">No expos available</span>
              </div>
            ) : (
              <Controller
                name="expoId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.expoId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select expo" />
                    </SelectTrigger>
                    <SelectContent>
                      {exposData?.expos?.map((expo: any) => (
                        <SelectItem key={expo._id} value={expo._id}>
                          {expo.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.expoId && (
              <p className="text-sm text-red-500">{errors.expoId.message}</p>
            )}
          </div>

          {/* Physical Properties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Size *</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="10x10 ft"
                      className={`pl-10 ${errors.size ? 'border-red-500' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.size && (
                <p className="text-sm text-red-500">{errors.size.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="500.00"
                      className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Capacity *</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Controller
                  name="maxCapacity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      placeholder="5"
                      className={`pl-10 ${errors.maxCapacity ? 'border-red-500' : ''}`}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  )}
                />
              </div>
              {errors.maxCapacity && (
                <p className="text-sm text-red-500">{errors.maxCapacity.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., A1, B2, Main Hall"
                    className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                  />
                )}
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amenities *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watch('amenities')?.includes(amenity) || false}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
            {errors.amenities && (
              <p className="text-sm text-red-500">{errors.amenities.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                isEditing ? 'Update Booth' : 'Create Booth'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
