import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Development fallback when server is not running
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Server not available, using development fallback');
        // Simple mock authentication for development
        if (email && password.length >= 6) {
          const mockUser = {
            id: Date.now(),
            name: email.split('@')[0],
            email,
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=ffffff`
          };
          const mockToken = 'dev-token-' + Date.now();
          return {
            success: true,
            data: {
              user: mockUser,
              token: mockToken
            }
          };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      throw error;
    }
  },
  
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error) {
      // Development fallback when server is not running
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Server not available, using development fallback');
        // Simple mock registration for development
        if (name && email && password.length >= 6) {
          const mockUser = {
            id: Date.now(),
            name,
            email,
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=ffffff`
          };
          const mockToken = 'dev-token-' + Date.now();
          return {
            success: true,
            data: {
              user: mockUser,
              token: mockToken
            }
          };
        } else {
          throw new Error('Please fill all fields and use a password with at least 6 characters');
        }
      }
      throw error;
    }
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },
  
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/updatepassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

// Task API functions
export const taskAPI = {
  getTasks: async (params = {}) => {
    try {
      const response = await api.get('/tasks', { params });
      return response.data;
    } catch (error) {
      // Development fallback when server is not running
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.warn('Server not available, using mock tasks for development');
        return {
          success: true,
          data: [
            {
              _id: '1',
              title: 'Welcome to Task Manager!',
              description: 'This is a sample task to get you started. You can edit or delete it.',
              status: 'pending',
              priority: 'medium',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: '2',
              title: 'Plan your day',
              description: 'Use this task manager to organize your daily activities and boost productivity.',
              status: 'pending',
              priority: 'high',
              dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        };
      }
      throw error;
    }
  },
  
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },
  
  addComment: async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  }
};

// User Profile API functions
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deleteAvatar: async () => {
    const response = await api.delete('/users/profile/avatar');
    return response.data;
  },
  
  addWorkHistory: async (workData) => {
    const response = await api.post('/users/profile/work-history', workData);
    return response.data;
  },
  
  updateWorkHistory: async (id, workData) => {
    const response = await api.put(`/users/profile/work-history/${id}`, workData);
    return response.data;
  },
  
  deleteWorkHistory: async (id) => {
    const response = await api.delete(`/users/profile/work-history/${id}`);
    return response.data;
  },
  
  addSkill: async (skillData) => {
    const response = await api.post('/users/profile/skills', skillData);
    return response.data;
  },
  
  updateSkill: async (id, skillData) => {
    const response = await api.put(`/users/profile/skills/${id}`, skillData);
    return response.data;
  },
  
  deleteSkill: async (id) => {
    const response = await api.delete(`/users/profile/skills/${id}`);
    return response.data;
  },
  
  getUserStats: async () => {
    const response = await api.get('/users/profile/stats');
    return response.data;
  }
};

export default api;
