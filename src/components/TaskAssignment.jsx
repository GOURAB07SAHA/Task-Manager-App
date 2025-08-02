import React, { useState } from 'react';
import { FaUserPlus, FaPaperPlane } from 'react-icons/fa';

const TaskAssignment = () => {
  const [memberEmail, setMemberEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const handleAssignTask = () => {
    if (!memberEmail || !taskTitle) {
      alert('Please fill in member email and task title');
      return;
    }
    // Placeholder logic for assigning task
    alert(`Task '${taskTitle}' assigned to ${memberEmail}`);
    setMemberEmail('');
    setTaskTitle('');
    setTaskDescription('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaUserPlus className="mr-2 text-blue-600" /> Assign Task to a Team Member
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Member Email or Username
          </label>
          <input
            type="text"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email or username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
            rows="3"
          ></textarea>
        </div>
        <button
          onClick={handleAssignTask}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
        >
          <FaPaperPlane size={14} />
          <span>Assign Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskAssignment;
