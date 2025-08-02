import React from 'react';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };

  const priorityTextColors = {
    high: 'text-red-700',
    medium: 'text-yellow-700',
    low: 'text-green-700'
  };

  return (
    <div className={`p-6 border-l-4 rounded-xl shadow-lg mb-4 bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${priorityColors[task.priority]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mb-3 leading-relaxed ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center flex-wrap gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${priorityTextColors[task.priority]} bg-white shadow-sm`}>
              {task.priority.toUpperCase()}
            </span>
            {task.dueDate && (
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                📅 {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {task.completed && (
              <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                ✅ Completed
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
              task.completed 
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <FaCheck size={14} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 transform hover:scale-110 shadow-md"
            title="Edit task"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 transform hover:scale-110 shadow-md"
            title="Delete task"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
