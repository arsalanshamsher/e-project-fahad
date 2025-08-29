// API service layer for connecting frontend with backend
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // console.log('Making API call to:', `${API_BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle token expiration
    if (response.status === 401) {
      console.log('Token expired, clearing auth data');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Authentication expired. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    // console.log('API response for', endpoint, ':', data);
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (userData: any) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getProfile: () => apiCall('/auth/profile'),
};

// Expo APIs
export const expoAPI = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const endpoint = `/expos?${queryParams.toString()}`;
    return apiCall(endpoint);
  },
  
  getById: (id: string) => apiCall(`/expos/${id}`),
  
  create: (expoData: any) =>
    apiCall('/expos', {
      method: 'POST',
      body: JSON.stringify(expoData),
    }),
  
  update: (id: string, expoData: any) =>
    apiCall(`/expos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expoData),
    }),
  
  delete: (id: string) =>
    apiCall(`/expos/${id}`, { method: 'DELETE' }),
  
  getAnalytics: (id: string) => apiCall(`/expos/${id}/analytics`),
  
  getStatistics: (id: string) => apiCall(`/expos/${id}/statistics`),
};

// Booth APIs
export const boothAPI = {
  getAll: (expoId?: string, params?: { page?: number; limit?: number; category?: string; status?: string }) => {
    if (expoId) {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      
      return apiCall(`/booths/expo/${expoId}?${queryParams.toString()}`);
    } else {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      
      return apiCall(`/booths?${queryParams.toString()}`);
    }
  },
  
  getByExpo: (expoId: string, params?: { page?: number; limit?: number; category?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiCall(`/booths/expo/${expoId}?${queryParams.toString()}`);
  },
  
  getById: (id: string) => apiCall(`/booths/${id}`),
  
  create: (boothData: any) =>
    apiCall('/booths', {
      method: 'POST',
      body: JSON.stringify(boothData),
    }),
  
  update: (id: string, boothData: any) =>
    apiCall(`/booths/${id}`, {
      method: 'PUT',
      body: JSON.stringify(boothData),
    }),
  
  delete: (id: string) =>
    apiCall(`/booths/${id}`, { method: 'DELETE' }),
  
  book: (id: string) =>
    apiCall(`/booths/${id}/book`, { method: 'POST' }),
  
  cancelBooking: (id: string) =>
    apiCall(`/booths/${id}/cancel-booking`, { method: 'POST' }),
  
  getAnalytics: (expoId: string) => apiCall(`/booths/expo/${expoId}/analytics`),
};

// Session APIs
export const sessionAPI = {
  getByExpo: (expoId: string, params?: { page?: number; limit?: number; type?: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    
    return apiCall(`/sessions/expo/${expoId}?${queryParams.toString()}`);
  },
  
  getById: (id: string) => apiCall(`/sessions/${id}`),
  
  create: (sessionData: any) =>
    apiCall('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),
  
  update: (id: string, sessionData: any) =>
    apiCall(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    }),
  
  delete: (id: string) =>
    apiCall(`/sessions/${id}`, { method: 'DELETE' }),
  
  register: (id: string) =>
    apiCall(`/sessions/${id}/register`, { method: 'POST' }),
  
  cancelRegistration: (id: string) =>
    apiCall(`/sessions/${id}/cancel-registration`, { method: 'POST' }),
  
  getAnalytics: (expoId: string) => apiCall(`/sessions/expo/${expoId}/analytics`),
};

// User APIs
export const userAPI = {
  getAll: (params?: { page?: number; limit?: number; role?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiCall(`/users?${queryParams.toString()}`);
  },
  
  getById: (id: string) => apiCall(`/users/${id}`),
  
  create: (userData: any) =>
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  update: (id: string, userData: any) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  delete: (id: string) =>
    apiCall(`/users/${id}`, { method: 'DELETE' }),
  
  getStats: () => apiCall('/users/stats'),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiCall(`/notifications?${queryParams.toString()}`);
  },
  
  markAsRead: (id: string) =>
    apiCall(`/notifications/${id}/read`, { method: 'PUT' }),
  
  markAllAsRead: () =>
    apiCall('/notifications/mark-all-read', { method: 'PUT' }),
  
  getSettings: () => apiCall('/notifications/settings'),
  
  updateSettings: (settings: any) =>
    apiCall('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  
  send: (notificationData: any) =>
    apiCall('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// Message APIs
export const messageAPI = {
  getInbox: (params?: { page?: number; limit?: number; type?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    
    return apiCall(`/messages/inbox?${queryParams.toString()}`);
  },
  
  getSent: (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiCall(`/messages/sent?${queryParams.toString()}`);
  },
  
  send: (messageData: any) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
  
  getConversation: (userId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return apiCall(`/messages/conversation/${userId}?${queryParams.toString()}`);
  },
  
  delete: (id: string) =>
    apiCall(`/messages/${id}`, { method: 'DELETE' }),
};

// Feedback APIs
export const feedbackAPI = {
  submit: (feedbackData: any) =>
    apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),
  
  getUserFeedback: (params?: { page?: number; limit?: number; type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    
    return apiCall(`/feedback/user?${queryParams.toString()}`);
  },
  
  getExpoFeedback: (expoId: string, params?: { page?: number; limit?: number; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    
    return apiCall(`/feedback/expo/${expoId}?${queryParams.toString()}`);
  },
  
  getAnalytics: (expoId?: string, params?: { startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams();
    if (expoId) queryParams.append('expo', expoId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return apiCall(`/feedback/analytics?${queryParams.toString()}`);
  },
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'),
};
