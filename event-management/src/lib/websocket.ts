// WebSocket service for real-time communication
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private isConnecting = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string = 'ws://localhost:5000/ws') {}

  // Connect to WebSocket server
  connect(token?: string) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    
    try {
      const wsUrl = token ? `${this.url}?token=${token}` : this.url;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.stopHeartbeat();
        this.emit('disconnected', event);
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.reconnectAttempts = 0;
  }

  // Send message to WebSocket server
  send(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = { type, data, timestamp: Date.now() };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  // Emit event to all listeners
  private emit(event: string, data?: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Handle incoming messages
  private handleMessage(data: any) {
    const { type, payload, timestamp } = data;
    
    switch (type) {
      case 'notification':
        this.emit('notification', payload);
        break;
      case 'message':
        this.emit('message', payload);
        break;
      case 'expo_update':
        this.emit('expo_update', payload);
        break;
      case 'booth_update':
        this.emit('booth_update', payload);
        break;
      case 'session_update':
        this.emit('session_update', payload);
        break;
      case 'user_update':
        this.emit('user_update', payload);
        break;
      case 'pong':
        // Heartbeat response
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  // Schedule reconnection attempt
  private scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      } else {
        console.error('Max reconnection attempts reached');
        this.emit('reconnect_failed');
      }
    }, delay);
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000); // Send ping every 30 seconds
  }

  // Stop heartbeat
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Get connection status
  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Get connection state
  get connectionState() {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export types for real-time events
export interface RealTimeEvent {
  type: string;
  payload: any;
  timestamp: number;
}

export interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  expoId?: string;
  userId?: string;
}

export interface MessageEvent {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
}

export interface ExpoUpdateEvent {
  id: string;
  action: 'created' | 'updated' | 'deleted';
  data: any;
}

export interface BoothUpdateEvent {
  id: string;
  expoId: string;
  action: 'created' | 'updated' | 'deleted' | 'booked' | 'cancelled';
  data: any;
}

export interface SessionUpdateEvent {
  id: string;
  expoId: string;
  action: 'created' | 'updated' | 'deleted' | 'registered' | 'cancelled';
  data: any;
}
