import React from 'react';

const TaskFilter = ({ filter, onFilterChange }) => {
  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Filter by:</span>
      {filterOptions.map(option => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;
