import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Mail, Phone, Shield, Building, MapPin } from 'lucide-react';
import { useCreateUser, useUpdateUser, useUser } from '../../hooks/useDynamicData';
import { useAuth } from '../../contexts/AuthContext';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['admin', 'organizer', 'exhibitor', 'attendee']),
  company: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess, onCancel }) => {
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!userId;

  // Fetch existing user data if editing
  const { data: existingUser, isLoading: isLoadingUser } = useUser(userId || '');
  
  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

          const {
          register,
          handleSubmit,
          formState: { errors, isValid },
          setValue,
          watch,
          reset,
        } = useForm<UserFormData>({
          resolver: zodResolver(userSchema),
          mode: 'onChange',
          defaultValues: {
            status: 'active',
            role: 'attendee',
            name: '',
            email: '',
            phone: '',
            company: '',
            position: '',
            address: '',
          },
        });

  // Populate form with existing data
  useEffect(() => {
    if (existingUser && isEditing) {
      try {
        console.log('Populating form with user data:', existingUser);
        
        // Handle nested user data structure from backend
        const userData = existingUser.user || existingUser;
        console.log('Extracted user data:', userData);
        
        // Define safe fields to populate
        const safeFields = ['name', 'email', 'phone', 'role', 'company', 'position', 'address', 'status'];
        
        safeFields.forEach((field) => {
          if (userData[field] !== undefined && userData[field] !== null) {
            console.log(`Setting ${field} to:`, userData[field]);
            setValue(field as keyof UserFormData, userData[field]);
          }
        });
        
        console.log('Form population completed');
      } catch (error) {
        console.error('Error populating form:', error);
      }
    }
  }, [existingUser, isEditing, setValue]);

  const onSubmit = async (data: UserFormData) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      const userData = { ...data };
      
      // Remove confirmPassword from submission
      delete userData.confirmPassword;
      
      // Only include password if it's being set
      if (!userData.password) {
        delete userData.password;
      }

      if (isEditing) {
        await updateUser.mutateAsync({ id: userId, data: userData });
      } else {
        await createUser.mutateAsync({
          ...userData,
          createdBy: currentUser.id,
          createdAt: new Date().toISOString(),
        });
      }
      
      onSuccess?.();
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(`Failed to save user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state if user data failed to load
  if (isEditing && !existingUser && !isLoadingUser) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <User className="h-5 w-5" />
            Error Loading User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Failed to load user data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {isEditing ? 'Edit User' : 'Create New User'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('name')}
                  placeholder="Enter full name"
                  className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Enter email address"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('phone')}
                  placeholder="Enter phone number"
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role *</label>
              <Select 
                value={watch('role') || undefined} 
                onValueChange={(value) => setValue('role', value as any)}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendee">Event Attendee</SelectItem>
                  <SelectItem value="exhibitor">Exhibitor</SelectItem>
                  <SelectItem value="organizer">Event Organizer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('company')}
                  placeholder="Enter company name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input
                {...register('position')}
                placeholder="Enter job position"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('address')}
                placeholder="Enter address"
                className="pl-10"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status *</label>
            <Select 
              value={watch('status') || undefined} 
              onValueChange={(value) => setValue('status', value as any)}
            >
              <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          {/* Password Fields */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password *</label>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Enter password"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password *</label>
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          )}

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
                isEditing ? 'Update User' : 'Create User'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
