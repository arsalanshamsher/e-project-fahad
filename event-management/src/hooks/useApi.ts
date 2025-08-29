import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expoAPI, boothAPI, sessionAPI, userAPI, notificationAPI, messageAPI, feedbackAPI } from '../lib/api';

// Expo hooks
export const useExpos = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['expos', params],
    queryFn: () => expoAPI.getAll(params),
  });
};

export const useExpo = (id: string) => {
  return useQuery({
    queryKey: ['expo', id],
    queryFn: () => expoAPI.getById(id),
    enabled: !!id,
  });
};

export const useExpoAnalytics = (id: string) => {
  return useQuery({
    queryKey: ['expo', id, 'analytics'],
    queryFn: () => expoAPI.getAnalytics(id),
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
      queryClient.invalidateQueries({ queryKey: ['expo', id] });
      queryClient.invalidateQueries({ queryKey: ['expos'] });
    },
  });
};

// Booth hooks
export const useBooths = (expoId: string, params?: { page?: number; limit?: number; category?: string; status?: string }) => {
  return useQuery({
    queryKey: ['booths', expoId, params],
    queryFn: () => boothAPI.getByExpo(expoId, params),
    enabled: !!expoId,
  });
};

export const useBooth = (id: string) => {
  return useQuery({
    queryKey: ['booth', id],
    queryFn: () => boothAPI.getById(id),
    enabled: !!id,
  });
};

export const useBookBooth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: boothAPI.book,
    onSuccess: (_, boothId) => {
      queryClient.invalidateQueries({ queryKey: ['booth', boothId] });
      queryClient.invalidateQueries({ queryKey: ['booths'] });
    },
  });
};

// Session hooks
export const useSessions = (expoId: string, params?: { page?: number; limit?: number; type?: string; category?: string }) => {
  return useQuery({
    queryKey: ['sessions', expoId, params],
    queryFn: () => sessionAPI.getByExpo(expoId, params),
    enabled: !!expoId,
  });
};

export const useSession = (id: string) => {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionAPI.getById(id),
    enabled: !!id,
  });
};

export const useRegisterForSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sessionAPI.register,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// User hooks
export const useUsers = (params?: { page?: number; limit?: number; role?: string; status?: string }) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userAPI.getAll(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userAPI.getById(id),
    enabled: !!id,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => userAPI.getStats(),
  });
};

// Notification hooks
export const useNotifications = (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationAPI.getAll(params),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification', notificationId] });
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

// Message hooks
export const useInbox = (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
  return useQuery({
    queryKey: ['messages', 'inbox', params],
    queryFn: () => messageAPI.getInbox(params),
  });
};

export const useSentMessages = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['messages', 'sent', params],
    queryFn: () => messageAPI.getSent(params),
  });
};

export const useConversation = (userId: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['messages', 'conversation', userId, params],
    queryFn: () => messageAPI.getConversation(userId, params),
    enabled: !!userId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageAPI.send,
    onSuccess: (_, messageData) => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'sent'] });
      if (messageData.recipient) {
        queryClient.invalidateQueries({ queryKey: ['messages', 'conversation', messageData.recipient] });
      }
    },
  });
};

// Feedback hooks
export const useUserFeedback = (params?: { page?: number; limit?: number; type?: string }) => {
  return useQuery({
    queryKey: ['feedback', 'user', params],
    queryFn: () => feedbackAPI.getUserFeedback(params),
  });
};

export const useExpoFeedback = (expoId: string, params?: { page?: number; limit?: number; category?: string }) => {
  return useQuery({
    queryKey: ['feedback', 'expo', expoId, params],
    queryFn: () => feedbackAPI.getExpoFeedback(expoId, params),
    enabled: !!expoId,
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: feedbackAPI.submit,
    onSuccess: (_, feedbackData) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', 'user'] });
      if (feedbackData.expo) {
        queryClient.invalidateQueries({ queryKey: ['feedback', 'expo', feedbackData.expo] });
      }
    },
  });
};
