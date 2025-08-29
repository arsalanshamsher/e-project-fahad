import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  expoAPI, 
  boothAPI, 
  sessionAPI, 
  userAPI, 
  notificationAPI, 
  messageAPI, 
  feedbackAPI 
} from '../lib/api';

// ===== EXPO MANAGEMENT =====
export const useExpos = (params?: { page?: number; limit?: number; status?: string; organizerId?: string }) => {
  return useQuery({
    queryKey: ['expos', params],
    queryFn: () => expoAPI.getAll(params),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

export const useExpo = (id: string) => {
  return useQuery({
    queryKey: ['expo', id],
    queryFn: () => expoAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateExpo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expoAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expos'] });
    },
  });
};

export const useUpdateExpo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => expoAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['expos'] });
      queryClient.invalidateQueries({ queryKey: ['expo', id] });
    },
  });
};

export const useDeleteExpo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expoAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expos'] });
    },
  });
};

// ===== BOOTH MANAGEMENT =====
export const useBooths = (expoId?: string, params?: { status?: string; type?: string }) => {
  return useQuery({
    queryKey: ['booths', expoId, params],
    queryFn: () => boothAPI.getAll(expoId, params),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

export const useBooth = (id: string) => {
  return useQuery({
    queryKey: ['booth', id],
    queryFn: () => boothAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateBooth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: boothAPI.create,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['booths', expoId] });
    },
  });
};

export const useUpdateBooth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => boothAPI.update(id, data),
    onSuccess: (_, { id, expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['booths', expoId] });
      queryClient.invalidateQueries({ queryKey: ['booth', id] });
    },
  });
};

export const useDeleteBooth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: boothAPI.delete,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['booths', expoId] });
    },
  });
};

export const useBookBooth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: boothAPI.book,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['booths', expoId] });
    },
  });
};

// ===== SESSION MANAGEMENT =====
export const useSessions = (expoId?: string, params?: { status?: string; type?: string }) => {
  return useQuery({
    queryKey: ['sessions', expoId, params],
    queryFn: () => sessionAPI.getAll(expoId, params),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionAPI.create,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', expoId] });
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => sessionAPI.update(id, data),
    onSuccess: (_, { id, expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', expoId] });
      queryClient.invalidateQueries({ queryKey: ['session', id] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionAPI.delete,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions', expoId] });
    },
  });
};

export const useRegisterForSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionAPI.register,
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
};

// ===== USER MANAGEMENT =====
export const useUsers = (params?: { role?: string; status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userAPI.getAll(params),
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // 2 minutes
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userAPI.getById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// ===== NOTIFICATION MANAGEMENT =====
export const useNotifications = (params?: { read?: boolean; type?: string }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationAPI.getAll(params),
    staleTime: 15000, // 15 seconds
    refetchInterval: 30000, // 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// ===== MESSAGE MANAGEMENT =====
export const useMessages = (params?: { conversationId?: string; senderId?: string; receiverId?: string }) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messageAPI.getAll(params),
    staleTime: 10000, // 10 seconds
    refetchInterval: 20000, // 20 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageAPI.send,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', { conversationId }] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: messageAPI.delete,
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', { conversationId }] });
    },
  });
};

// ===== FEEDBACK MANAGEMENT =====
export const useFeedback = (params?: { expoId?: string; type?: string; rating?: number }) => {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => feedbackAPI.getAll(params),
    staleTime: 60000,
    refetchInterval: 120000,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: feedbackAPI.submit,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', { expoId }] });
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => feedbackAPI.update(id, data),
    onSuccess: (_, { id, expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', { expoId }] });
      queryClient.invalidateQueries({ queryKey: ['feedback', id] });
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: feedbackAPI.delete,
    onSuccess: (_, { expoId }) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', { expoId }] });
    },
  });
};

// ===== ANALYTICS DATA =====
export const useAnalyticsData = (expoId?: string, timeRange: string = '7d') => {
  return useQuery({
    queryKey: ['analytics', expoId, timeRange],
    queryFn: async () => {
      // Fetch real analytics data from backend
      const [attendanceData, revenueData, feedbackData] = await Promise.all([
        expoAPI.getAttendanceAnalytics(expoId, timeRange),
        expoAPI.getRevenueAnalytics(expoId, timeRange),
        expoAPI.getFeedbackAnalytics(expoId, timeRange),
      ]);

      return {
        attendance: attendanceData,
        revenue: revenueData,
        feedback: feedbackData,
        summary: {
          totalAttendees: attendanceData.reduce((sum: number, item: any) => sum + item.attendees, 0),
          totalRevenue: revenueData.reduce((sum: number, item: any) => sum + item.totalRevenue, 0),
          averageRating: feedbackData.reduce((sum: number, item: any) => sum + item.rating, 0) / feedbackData.length,
        }
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// ===== REAL-TIME UPDATES =====
export const useRealTimeData = (expoId?: string) => {
  return useQuery({
    queryKey: ['realtime', expoId],
    queryFn: async () => {
      // Get real-time data including active users, live updates, etc.
      const [activeUsers, liveUpdates, systemStatus] = await Promise.all([
        expoAPI.getActiveUsers(expoId),
        expoAPI.getLiveUpdates(expoId),
        expoAPI.getSystemStatus(),
      ]);

      return {
        activeUsers,
        liveUpdates,
        systemStatus,
        timestamp: new Date().toISOString(),
      };
    },
    staleTime: 5000, // 5 seconds
    refetchInterval: 10000, // 10 seconds
  });
};
