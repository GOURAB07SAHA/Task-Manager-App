import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaTasks, FaUser, FaUsers } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-2xl font-bold">TaskFlow</h1>
              <p className="text-blue-100 text-sm">Organize • Focus • Achieve</p>
            </div>
            {user && (
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => navigate('/tasks')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/tasks' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <FaTasks size={16} />
                  <span>Tasks</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/profile' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <FaUser size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => navigate('/team')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/team' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <FaUsers size={16} />
                  <span>Team</span>
                </button>
              </nav>
            )}
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border-2 border-blue-300"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-blue-200">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
