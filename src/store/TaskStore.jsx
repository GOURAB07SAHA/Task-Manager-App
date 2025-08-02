import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { taskAPI } from '../services/api';

// Initial state
const initialState = {
  tasks: [],
  filter: 'all', // all, completed, pending, overdue
  sortBy: 'dueDate', // dueDate, priority, title, status
  sortOrder: 'asc', // asc, desc
  searchQuery: '',
  selectedTask: null,
  loading: false,
  error: null
};

// Action types
export const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_TASKS: 'LOAD_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK_STATUS: 'TOGGLE_TASK_STATUS',
  SET_FILTER: 'SET_FILTER',
  SET_SORT: 'SET_SORT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SELECT_TASK: 'SELECT_TASK',
  CLEAR_SELECTED_TASK: 'CLEAR_SELECTED_TASK',
  BULK_UPDATE_TASKS: 'BULK_UPDATE_TASKS',
  CLEAR_COMPLETED_TASKS: 'CLEAR_COMPLETED_TASKS'
};

// Reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case TASK_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case TASK_ACTIONS.LOAD_TASKS:
      return { ...state, tasks: action.payload, loading: false, error: null };
    
    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload, updatedAt: new Date().toISOString() }
            : task
        )
      };
    
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        selectedTask: state.selectedTask?.id === action.payload ? null : state.selectedTask
      };
    
    case TASK_ACTIONS.TOGGLE_TASK_STATUS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? {
                ...task,
                status: task.status === 'completed' ? 'pending' : 'completed',
                completedAt: task.status === 'pending' ? new Date().toISOString() : null,
                updatedAt: new Date().toISOString()
              }
            : task
        )
      };
    
    case TASK_ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };
    
    case TASK_ACTIONS.SET_SORT:
      return { 
        ...state, 
        sortBy: action.payload.sortBy || state.sortBy,
        sortOrder: action.payload.sortOrder || state.sortOrder
      };
    
    case TASK_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case TASK_ACTIONS.SELECT_TASK:
      return { ...state, selectedTask: action.payload };
    
    case TASK_ACTIONS.CLEAR_SELECTED_TASK:
      return { ...state, selectedTask: null };
    
    case TASK_ACTIONS.BULK_UPDATE_TASKS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          action.payload.taskIds.includes(task.id)
            ? { ...task, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : task
        )
      };
    
    case TASK_ACTIONS.CLEAR_COMPLETED_TASKS:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.status !== 'completed')
      };
    
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasksFromAPI = async () => {
      try {
        dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
        const response = await taskAPI.getTasks();
        dispatch({ type: TASK_ACTIONS.LOAD_TASKS, payload: response.data });
      } catch (error) {
        console.error('Error loading tasks from API:', error);
        dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: 'Failed to load tasks' });
      }
    };
    
    // Only load if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      loadTasksFromAPI();
    }
  }, []);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: error }),
    
    loadTasks: (tasks) => dispatch({ type: TASK_ACTIONS.LOAD_TASKS, payload: tasks }),
    
    addTask: (taskData) => dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: taskData }),
    
    updateTask: (taskData) => dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: taskData }),
    
    deleteTask: (taskId) => dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId }),
    
    toggleTaskStatus: (taskId) => dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_STATUS, payload: taskId }),
    
    setFilter: (filter) => dispatch({ type: TASK_ACTIONS.SET_FILTER, payload: filter }),
    
    setSort: (sortConfig) => dispatch({ type: TASK_ACTIONS.SET_SORT, payload: sortConfig }),
    
    setSearchQuery: (query) => dispatch({ type: TASK_ACTIONS.SET_SEARCH_QUERY, payload: query }),
    
    selectTask: (task) => dispatch({ type: TASK_ACTIONS.SELECT_TASK, payload: task }),
    
    clearSelectedTask: () => dispatch({ type: TASK_ACTIONS.CLEAR_SELECTED_TASK }),
    
    bulkUpdateTasks: (taskIds, updates) => 
      dispatch({ type: TASK_ACTIONS.BULK_UPDATE_TASKS, payload: { taskIds, updates } }),
    
    clearCompletedTasks: () => dispatch({ type: TASK_ACTIONS.CLEAR_COMPLETED_TASKS })
  };

  // Computed values/selectors
  const selectors = {
    // Get filtered and sorted tasks
    getFilteredTasks: () => {
      let filtered = state.tasks;

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(task =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Apply status filter
      switch (state.filter) {
        case 'completed':
          filtered = filtered.filter(task => task.status === 'completed');
          break;
        case 'pending':
          filtered = filtered.filter(task => task.status === 'pending');
          break;
        case 'overdue':
          filtered = filtered.filter(task => {
            if (task.status === 'completed') return false;
            return task.dueDate && new Date(task.dueDate) < new Date();
          });
          break;
        default:
          break;
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[state.sortBy];
        let bValue = b[state.sortBy];

        // Handle different data types
        if (state.sortBy === 'dueDate' || state.sortBy === 'createdAt') {
          aValue = aValue ? new Date(aValue) : new Date('9999-12-31');
          bValue = bValue ? new Date(bValue) : new Date('9999-12-31');
        } else if (state.sortBy === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[aValue] || 0;
          bValue = priorityOrder[bValue] || 0;
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue ? bValue.toLowerCase() : '';
        }

        if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      return filtered;
    },

    // Get task statistics
    getTaskStats: () => {
      const total = state.tasks.length;
      const completed = state.tasks.filter(task => task.status === 'completed').length;
      const pending = state.tasks.filter(task => task.status === 'pending').length;
      const overdue = state.tasks.filter(task => {
        if (task.status === 'completed') return false;
        return task.dueDate && new Date(task.dueDate) < new Date();
      }).length;

      return { total, completed, pending, overdue };
    },

    // Get tasks by priority
    getTasksByPriority: () => {
      return {
        high: state.tasks.filter(task => task.priority === 'high'),
        medium: state.tasks.filter(task => task.priority === 'medium'),
        low: state.tasks.filter(task => task.priority === 'low')
      };
    },

    // Get upcoming tasks (due in next 7 days)
    getUpcomingTasks: () => {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      return state.tasks.filter(task => {
        if (task.status === 'completed' || !task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      });
    }
  };

  const value = {
    ...state,
    ...actions,
    ...selectors
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the Task context
export const useTaskStore = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskStore must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
