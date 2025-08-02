import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskList from './pages/TaskList';
import ProfilePage from './pages/ProfilePage';
import TeamManagement from './pages/TeamManagement';
import StoreDemo from './components/StoreDemo';
import { TaskProvider } from './store/TaskStore';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <TeamManagement />
                </ProtectedRoute>
              } />
              <Route path="/store-demo" element={
                <ProtectedRoute>
                  <StoreDemo />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
