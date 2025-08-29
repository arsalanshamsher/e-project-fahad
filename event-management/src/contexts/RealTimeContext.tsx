import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { websocketService, NotificationEvent, MessageEvent, ExpoUpdateEvent, BoothUpdateEvent, SessionUpdateEvent } from '../lib/websocket';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface RealTimeContextType {
  isConnected: boolean;
  connectionState: string;
  notifications: NotificationEvent[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (user && token) {
      websocketService.connect(token);
    } else {
      websocketService.disconnect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user, token]);

  // Listen to WebSocket events
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState('connected');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState('disconnected');
    };

    const handleError = () => {
      setConnectionState('error');
    };

    const handleNotification = (notification: NotificationEvent) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Invalidate relevant queries to refresh data
      if (notification.expoId) {
        queryClient.invalidateQueries({ queryKey: ['expo', notification.expoId] });
      }
      if (notification.userId) {
        queryClient.invalidateQueries({ queryKey: ['user', notification.userId] });
      }
      
      // Show toast notification
      showToastNotification(notification);
    };

    const handleMessage = (message: MessageEvent) => {
      // Invalidate message queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'sent'] });
      
      // Show toast notification for new messages
      showToastNotification({
        id: message.id,
        title: 'New Message',
        message: `From: ${message.sender}`,
        type: 'message',
        priority: 'normal'
      });
    };

    const handleExpoUpdate = (update: ExpoUpdateEvent) => {
      // Invalidate expo queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['expos'] });
      queryClient.invalidateQueries({ queryKey: ['expo', update.id] });
      
      // Show toast notification for expo updates
      showToastNotification({
        id: update.id,
        title: `Expo ${update.action}`,
        message: `Expo has been ${update.action}`,
        type: 'expo_update',
        priority: 'normal'
      });
    };

    const handleBoothUpdate = (update: BoothUpdateEvent) => {
      // Invalidate booth queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['booths', update.expoId] });
      queryClient.invalidateQueries({ queryKey: ['booth', update.id] });
      
      // Show toast notification for booth updates
      showToastNotification({
        id: update.id,
        title: `Booth ${update.action}`,
        message: `Booth has been ${update.action}`,
        type: 'booth_update',
        priority: 'normal'
      });
    };

    const handleSessionUpdate = (update: SessionUpdateEvent) => {
      // Invalidate session queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['sessions', update.expoId] });
      queryClient.invalidateQueries({ queryKey: ['session', update.id] });
      
      // Show toast notification for session updates
      showToastNotification({
        id: update.id,
        title: `Session ${update.action}`,
        message: `Session has been ${update.action}`,
        type: 'session_update',
        priority: 'normal'
      });
    };

    // Subscribe to WebSocket events
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('notification', handleNotification);
    websocketService.on('message', handleMessage);
    websocketService.on('expo_update', handleExpoUpdate);
    websocketService.on('booth_update', handleBoothUpdate);
    websocketService.on('session_update', handleSessionUpdate);

    // Update connection state
    const updateConnectionState = () => {
      setConnectionState(websocketService.connectionState);
      setIsConnected(websocketService.isConnected);
    };

    // Check connection state periodically
    const interval = setInterval(updateConnectionState, 1000);

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('notification', handleNotification);
      websocketService.off('message', handleMessage);
      websocketService.off('expo_update', handleExpoUpdate);
      websocketService.off('booth_update', handleBoothUpdate);
      websocketService.off('session_update', handleSessionUpdate);
      clearInterval(interval);
    };
  }, [queryClient]);

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Show toast notification
  const showToastNotification = (notification: NotificationEvent) => {
    // This will be integrated with the toast system
    console.log('Toast notification:', notification);
    
    // You can integrate this with your toast library
    // toast({
    //   title: notification.title,
    //   description: notification.message,
    //   variant: notification.priority === 'high' ? 'destructive' : 'default'
    // });
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  const value: RealTimeContextType = {
    isConnected,
    connectionState,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};
