import React from 'react';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  const stats = [
    {
      icon: FaTasks,
      label: 'Total Tasks',
      value: totalTasks,
      color: 'bg-blue-500'
    },
    {
      icon: FaCheckCircle,
      label: 'Completed',
      value: completedTasks,
      color: 'bg-green-500'
    },
    {
      icon: FaClock,
      label: 'Pending',
      value: pendingTasks,
      color: 'bg-yellow-500'
    },
    {
      icon: FaExclamationTriangle,
      label: 'High Priority',
      value: highPriorityTasks,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-transparent hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group">
            <div className="flex items-center">
              <div className={`p-4 rounded-full ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
