import React, { useState } from 'react';
import { FaCog, FaBell, FaEye, FaPalette, FaDownload } from 'react-icons/fa';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailAlerts: false,
    autoSave: true,
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleExportData = () => {
    // Mock data export functionality
    const data = {
      user: JSON.parse(localStorage.getItem('taskManager_user') || '{}'),
      tasks: JSON.parse(localStorage.getItem('taskManager_tasks') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow_data_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center mb-6">
        <FaCog className="text-2xl text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FaBell className="text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Get notified about task deadlines</p>
            </div>
          </div>
          <label className="switch relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleSettingChange('notifications')}
              className="sr-only"
            />
            <span className={`slider absolute cursor-pointer inset-0 rounded-full transition-colors ${
              settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}>
              <span className={`dot absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
              }`}></span>
            </span>
          </label>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FaEye className="text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
          </div>
          <label className="switch relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleSettingChange('darkMode')}
              className="sr-only"
            />
            <span className={`slider absolute cursor-pointer inset-0 rounded-full transition-colors ${
              settings.darkMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}>
              <span className={`dot absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}></span>
            </span>
          </label>
        </div>

        {/* Email Alerts */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FaBell className="text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Email Alerts</h4>
              <p className="text-sm text-gray-600">Receive email reminders</p>
            </div>
          </div>
          <label className="switch relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={() => handleSettingChange('emailAlerts')}
              className="sr-only"
            />
            <span className={`slider absolute cursor-pointer inset-0 rounded-full transition-colors ${
              settings.emailAlerts ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <span className={`dot absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
              }`}></span>
            </span>
          </label>
        </div>

        {/* Auto Save */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <FaPalette className="text-orange-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Auto Save</h4>
              <p className="text-sm text-gray-600">Automatically save changes</p>
            </div>
          </div>
          <label className="switch relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={() => handleSettingChange('autoSave')}
              className="sr-only"
            />
            <span className={`slider absolute cursor-pointer inset-0 rounded-full transition-colors ${
              settings.autoSave ? 'bg-orange-600' : 'bg-gray-300'
            }`}>
              <span className={`dot absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
              }`}></span>
            </span>
          </label>
        </div>

        {/* Export Data */}
        <div className="border-t pt-6">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
          >
            <FaDownload size={16} />
            <span>Export All Data</span>
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Download your tasks and profile data as JSON file
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
