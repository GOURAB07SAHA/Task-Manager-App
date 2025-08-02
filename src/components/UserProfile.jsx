import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPen } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const UserProfile = () => {
  const { user } = useAuth();

  // Dummy task completion data for the growth graph
  const taskCompletionData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 8, 15],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const handlePhotoChange = () => {
    // Function to change user photo (placeholder logic)
    alert('Change photo functionality coming soon!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center space-x-6 mb-6">
        <div className="relative">
          <img
            className="w-24 h-24 rounded-full border-2 border-blue-300"
            src={user.avatar}
            alt={user.name}
          />
          <button
            onClick={handlePhotoChange}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
            title="Change Photo"
          >
            <FaPen />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Completion Growth</h3>
        <Line data={taskCompletionData} />
      </div>
    </div>
  );
};

export default UserProfile;

