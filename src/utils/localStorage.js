const TASKS_KEY = 'taskManager_tasks';

// Save tasks to localStorage
export const saveTasks = (tasks) => {
  try {
    const serializedTasks = JSON.stringify(tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null
    })));
    localStorage.setItem(TASKS_KEY, serializedTasks);
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Load tasks from localStorage
export const loadTasks = () => {
  try {
    const serializedTasks = localStorage.getItem(TASKS_KEY);
    if (serializedTasks === null) {
      // Return sample tasks for first-time users
      const sampleTasks = [
        {
          id: 1,
          title: 'Welcome to Task Manager!',
          description: 'This is a sample task to get you started. You can edit or delete it.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          priority: 'medium',
          completed: false,
        },
        {
          id: 2,
          title: 'Plan your day',
          description: 'Use this task manager to organize your daily activities and boost productivity.',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          priority: 'high',
          completed: false,
        },
        {
          id: 3,
          title: 'Learn React.js',
          description: 'Explore React components, hooks, and state management.',
          dueDate: null,
          priority: 'low',
          completed: true,
        },
      ];
      // Save sample tasks to localStorage
      saveTasks(sampleTasks);
      return sampleTasks;
    }
    const tasks = JSON.parse(serializedTasks);
    return tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    }));
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// Clear all tasks from localStorage
export const clearTasks = () => {
  try {
    localStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks from localStorage:', error);
  }
};
