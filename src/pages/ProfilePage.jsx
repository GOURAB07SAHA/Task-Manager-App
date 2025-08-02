import React, { useState } from 'react';
import Layout from '../components/Layout';
import Settings from '../components/Settings';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaEdit, FaSave, FaTimes, FaUser, FaEnvelope } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [photoPreview, setPhotoPreview] = useState(user?.avatar);

  // Dummy data for growth chart
  const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [8, 12, 15, 18, 25, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Dummy data for task category breakdown
  const categoryData = {
    labels: ['Work', 'Personal', 'Shopping', 'Health', 'Learning'],
    datasets: [
      {
        label: 'Tasks by Category',
        data: [25, 20, 10, 8, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Task Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Tasks by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Update user data (this would typically involve an API call)
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      avatar: photoPreview,
    };
    
    // For demo purposes, we'll update localStorage
    localStorage.setItem('taskManager_user', JSON.stringify(updatedUser));
    
    // Update context if updateUser function exists
    if (updateUser) {
      updateUser(updatedUser);
    }
    
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setPhotoPreview(user?.avatar);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Tasks', value: 78, color: 'bg-blue-500' },
    { label: 'Completed', value: 52, color: 'bg-green-500' },
    { label: 'In Progress', value: 18, color: 'bg-yellow-500' },
    { label: 'This Week', value: 12, color: 'bg-purple-500' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Analytics</h1>
        
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Photo */}
            <div className="relative">
              <img
                src={photoPreview}
                alt={user?.name}
                className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
                  <FaCamera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <FaSave size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                    >
                      <FaTimes size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                  <p className="text-gray-600 text-lg mb-4">{user?.email}</p>
                  <p className="text-gray-500 mb-6">Task management enthusiast 🚀</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <FaEdit size={16} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} opacity-20`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Task Completion Growth</h3>
            <div className="h-80">
              <Line data={growthData} options={chartOptions} />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Task Categories</h3>
            <div className="h-80">
              <Bar data={categoryData} options={barOptions} />
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-900">Task Master</h4>
              <p className="text-sm text-gray-600">Completed 50+ tasks</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900">Speed Demon</h4>
              <p className="text-sm text-gray-600">Completed 5 tasks in one day</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl mb-2">📈</div>
              <h4 className="font-semibold text-gray-900">Consistent</h4>
              <p className="text-sm text-gray-600">7 day streak</p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <Settings />
      </div>
    </Layout>
  );
};

export default ProfilePage;
