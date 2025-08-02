import React, { useState } from 'react';
import { useTaskStore } from '../store/TaskStore';

const StoreDemo = () => {
  const {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    toggleTaskStatus,
    setFilter,
    filter,
    getFilteredTasks,
    getTaskStats
  } = useTaskStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Task Store Demo</h2>
      
      {/* Store Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Store Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Loading:</span> 
            <span className={`ml-2 ${loading ? 'text-orange-600' : 'text-green-600'}`}>
              {loading ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="font-medium">Error:</span> 
            <span className={`ml-2 ${error ? 'text-red-600' : 'text-green-600'}`}>
              {error || 'None'}
            </span>
          </div>
          <div>
            <span className="font-medium">Total Tasks:</span> 
            <span className="ml-2 text-blue-600">{stats.total}</span>
          </div>
          <div>
            <span className="font-medium">Current Filter:</span> 
            <span className="ml-2 text-purple-600 capitalize">{filter}</span>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Task Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Add New Task Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <textarea
              placeholder="Task description..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Tasks</h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'completed', 'overdue'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-100'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredTasks.length} of {stats.total} tasks
        </div>
      </div>

      {/* Tasks List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Tasks ({filteredTasks.length})</h3>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {stats.total === 0 ? 'No tasks yet. Add your first task above!' : 'No tasks match the current filter.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-colors ${
                  task.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        task.status === 'completed'
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm mt-1 ${
                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.priority} priority
                      </span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                        task.status === 'completed'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {task.status === 'completed' ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Store Data (for debugging) */}
      <details className="mb-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
          Show Raw Store Data (Debug)
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 text-xs overflow-auto rounded">
          {JSON.stringify({ tasks, filter, stats }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default StoreDemo;
