import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, MapPin, Users, DollarSign, Clock, Tag, Image, Settings } from 'lucide-react';
import { useCreateExpo, useUpdateExpo, useExpo } from '../../hooks/useDynamicData';
import { useAuth } from '../../contexts/AuthContext';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';

const expoSchema = z.object({
  title: z.string().min(3, 'Expo title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  theme: z.string().min(3, 'Theme must be at least 3 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.object({
    venue: z.string().min(3, 'Venue name is required'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional()
  }),
  status: z.enum(['draft', 'published', 'active', 'completed', 'cancelled']),
  capacity: z.object({
    maxAttendees: z.number().min(1, 'Maximum attendees must be at least 1'),
    maxExhibitors: z.number().min(1, 'Maximum exhibitors must be at least 1'),
    maxBooths: z.number().min(1, 'Maximum booths must be at least 1')
  }),
  pricing: z.object({
    attendeePrice: z.number().min(0, 'Attendee price cannot be negative'),
    exhibitorPrice: z.number().min(0, 'Exhibitor price cannot be negative'),
    earlyBirdDiscount: z.number().min(0, 'Early bird discount cannot be negative').optional(),
    earlyBirdEndDate: z.string().optional()
  }),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  settings: z.object({
    allowPublicRegistration: z.boolean().default(true),
    requireApproval: z.boolean().default(false),
    maxBoothsPerExhibitor: z.number().min(1).default(1),
    allowBoothSharing: z.boolean().default(false)
  }).optional()
});

type ExpoFormData = z.infer<typeof expoSchema>;

interface ExpoFormProps {
  expoId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ExpoForm: React.FC<ExpoFormProps> = ({ expoId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const isEditing = !!expoId;

  // Fetch existing expo data if editing
  const { data: existingExpo, isLoading: isLoadingExpo } = useExpo(expoId || '');
  
  // Mutations
  const createExpo = useCreateExpo();
  const updateExpo = useUpdateExpo();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control
  } = useForm<ExpoFormData>({
    resolver: zodResolver(expoSchema),
    mode: 'onChange',
    defaultValues: {
      status: 'draft',
      capacity: {
        maxAttendees: 100,
        maxExhibitors: 20,
        maxBooths: 25
      },
      pricing: {
        attendeePrice: 0,
        exhibitorPrice: 0
      },
      categories: [],
      tags: [],
      settings: {
        allowPublicRegistration: true,
        requireApproval: false,
        maxBoothsPerExhibitor: 1,
        allowBoothSharing: false
      }
    }
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingExpo && isEditing) {
      // Map the existing data to form fields
      setValue('title', existingExpo.title || '');
      setValue('description', existingExpo.description || '');
      setValue('theme', existingExpo.theme || '');
      setValue('startDate', existingExpo.startDate ? new Date(existingExpo.startDate).toISOString().split('T')[0] : '');
      setValue('endDate', existingExpo.endDate ? new Date(existingExpo.endDate).toISOString().split('T')[0] : '');
      setValue('status', existingExpo.status || 'draft');
      
      if (existingExpo.location) {
        setValue('location.venue', existingExpo.location.venue || '');
        setValue('location.address', existingExpo.location.address || '');
        setValue('location.city', existingExpo.location.city || '');
        setValue('location.country', existingExpo.location.country || '');
      }
      
      if (existingExpo.capacity) {
        setValue('capacity.maxAttendees', existingExpo.capacity.maxAttendees || 100);
        setValue('capacity.maxExhibitors', existingExpo.capacity.maxExhibitors || 20);
        setValue('capacity.maxBooths', existingExpo.capacity.maxBooths || 25);
      }
      
      if (existingExpo.pricing) {
        setValue('pricing.attendeePrice', existingExpo.pricing.attendeePrice || 0);
        setValue('pricing.exhibitorPrice', existingExpo.pricing.exhibitorPrice || 0);
        setValue('pricing.earlyBirdDiscount', existingExpo.pricing.earlyBirdDiscount || 0);
        if (existingExpo.pricing.earlyBirdEndDate) {
          setValue('pricing.earlyBirdEndDate', new Date(existingExpo.pricing.earlyBirdEndDate).toISOString().split('T')[0]);
        }
      }
      
      if (existingExpo.categories) {
        setValue('categories', existingExpo.categories);
      }
      
      if (existingExpo.tags) {
        setValue('tags', existingExpo.tags);
      }
      
      if (existingExpo.settings) {
        setValue('settings.allowPublicRegistration', existingExpo.settings.allowPublicRegistration ?? true);
        setValue('settings.requireApproval', existingExpo.settings.requireApproval ?? false);
        setValue('settings.maxBoothsPerExhibitor', existingExpo.settings.maxBoothsPerExhibitor || 1);
        setValue('settings.allowBoothSharing', existingExpo.settings.allowBoothSharing ?? false);
      }
    }
  }, [existingExpo, isEditing, setValue]);

  // Validate end date is after start date
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      setValue('endDate', '');
    }
  }, [startDate, endDate, setValue]);

  const addCategory = () => {
    if (newCategory.trim() && !watch('categories')?.includes(newCategory.trim())) {
      const currentCategories = watch('categories') || [];
      setValue('categories', [...currentCategories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    const currentCategories = watch('categories') || [];
    setValue('categories', currentCategories.filter(cat => cat !== categoryToRemove));
  };

  const addTag = () => {
    if (newTag.trim() && !watch('tags')?.includes(newTag.trim())) {
      const currentTags = watch('tags') || [];
      setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch('tags') || [];
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: ExpoFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const expoData = {
        ...data,
        organizer: user.id,
        createdAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateExpo.mutateAsync({ id: expoId, data: expoData });
      } else {
        await createExpo.mutateAsync(expoData);
      }
      
      onSuccess?.();
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error('Error saving expo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingExpo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading expo...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Basic Information
        </CardTitle>
      </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Expo Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter expo title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="theme">Theme *</Label>
              <Input
                id="theme"
                {...register('theme')}
                placeholder="Enter expo theme"
                className={errors.theme ? 'border-red-500' : ''}
              />
              {errors.theme && <p className="text-red-500 text-sm mt-1">{errors.theme.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe the expo..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue">Venue Name *</Label>
              <Input
                id="venue"
                {...register('location.venue')}
                placeholder="Enter venue name"
                className={errors.location?.venue ? 'border-red-500' : ''}
              />
              {errors.location?.venue && <p className="text-red-500 text-sm mt-1">{errors.location.venue.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('location.city')}
                placeholder="Enter city"
                className={errors.location?.city ? 'border-red-500' : ''}
              />
              {errors.location?.city && <p className="text-red-500 text-sm mt-1">{errors.location.city.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                {...register('location.address')}
                placeholder="Enter full address"
                className={errors.location?.address ? 'border-red-500' : ''}
              />
              {errors.location?.address && <p className="text-red-500 text-sm mt-1">{errors.location.address.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                {...register('location.country')}
                placeholder="Enter country"
                className={errors.location?.country ? 'border-red-500' : ''}
              />
              {errors.location?.country && <p className="text-red-500 text-sm mt-1">{errors.location.country.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Capacity & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxAttendees">Max Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                {...register('capacity.maxAttendees', { valueAsNumber: true })}
                placeholder="100"
                className={errors.capacity?.maxAttendees ? 'border-red-500' : ''}
              />
              {errors.capacity?.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.capacity.maxAttendees.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="maxExhibitors">Max Exhibitors *</Label>
              <Input
                id="maxExhibitors"
                type="number"
                {...register('capacity.maxExhibitors', { valueAsNumber: true })}
                placeholder="20"
                className={errors.capacity?.maxExhibitors ? 'border-red-500' : ''}
              />
              {errors.capacity?.maxExhibitors && <p className="text-red-500 text-sm mt-1">{errors.capacity.maxExhibitors.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="maxBooths">Max Booths *</Label>
              <Input
                id="maxBooths"
                type="number"
                {...register('capacity.maxBooths', { valueAsNumber: true })}
                placeholder="25"
                className={errors.capacity?.maxBooths ? 'border-red-500' : ''}
              />
              {errors.capacity?.maxBooths && <p className="text-red-500 text-sm mt-1">{errors.capacity.maxBooths.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attendeePrice">Attendee Price ($) *</Label>
              <Input
                id="attendeePrice"
                type="number"
                step="0.01"
                {...register('pricing.attendeePrice', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.pricing?.attendeePrice ? 'border-red-500' : ''}
              />
              {errors.pricing?.attendeePrice && <p className="text-red-500 text-sm mt-1">{errors.pricing.attendeePrice.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="exhibitorPrice">Exhibitor Price ($) *</Label>
              <Input
                id="exhibitorPrice"
                type="number"
                step="0.01"
                {...register('pricing.exhibitorPrice', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.pricing?.exhibitorPrice ? 'border-red-500' : ''}
              />
              {errors.pricing?.exhibitorPrice && <p className="text-red-500 text-sm mt-1">{errors.pricing.exhibitorPrice.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="earlyBirdDiscount">Early Bird Discount (%)</Label>
              <Input
                id="earlyBirdDiscount"
                type="number"
                step="0.01"
                {...register('pricing.earlyBirdDiscount', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="earlyBirdEndDate">Early Bird End Date</Label>
              <Input
                id="earlyBirdEndDate"
                type="date"
                {...register('pricing.earlyBirdEndDate')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories & Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categories & Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Categories *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add category"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
              />
              <Button type="button" onClick={addCategory} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watch('categories')?.map((category, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeCategory(category)}>
                  {category} ×
                </Badge>
              ))}
            </div>
            {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>}
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {watch('tags')?.map((tag, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowPublicRegistration"
                checked={watch('settings.allowPublicRegistration')}
                onCheckedChange={(checked) => setValue('settings.allowPublicRegistration', checked as boolean)}
              />
              <Label htmlFor="allowPublicRegistration">Allow Public Registration</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireApproval"
                checked={watch('settings.requireApproval')}
                onCheckedChange={(checked) => setValue('settings.requireApproval', checked as boolean)}
              />
              <Label htmlFor="requireApproval">Require Approval</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxBoothsPerExhibitor">Max Booths Per Exhibitor</Label>
              <Input
                id="maxBoothsPerExhibitor"
                type="number"
                {...register('settings.maxBoothsPerExhibitor', { valueAsNumber: true })}
                placeholder="1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowBoothSharing"
                checked={watch('settings.allowBoothSharing')}
                onCheckedChange={(checked) => setValue('settings.allowBoothSharing', checked as boolean)}
              />
              <Label htmlFor="allowBoothSharing">Allow Booth Sharing</Label>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Form Actions */}
      <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Expo' : 'Create Expo')}
            </Button>
          </div>
        </form>
  );
};
