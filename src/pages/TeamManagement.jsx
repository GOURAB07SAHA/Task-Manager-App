import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaUsers, FaTasks, FaUserPlus, FaPaperPlane, FaCheck, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const TeamManagement = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', tasksAssigned: 5, tasksCompleted: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', tasksAssigned: 3, tasksCompleted: 2 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'QA Tester', tasksAssigned: 4, tasksCompleted: 4 },
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: 1, title: 'Fix login bug', assignedTo: 'john@example.com', assignedBy: user?.email, status: 'pending', priority: 'high', dueDate: '2024-01-15' },
    { id: 2, title: 'Design homepage', assignedTo: 'jane@example.com', assignedBy: user?.email, status: 'completed', priority: 'medium', dueDate: '2024-01-12' },
    { id: 3, title: 'Test payment flow', assignedTo: 'mike@example.com', assignedBy: user?.email, status: 'in-progress', priority: 'high', dueDate: '2024-01-20' },
  ]);

  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      alert('Please fill all member details');
      return;
    }

    const member = {
      id: Date.now(),
      ...newMember,
      tasksAssigned: 0,
      tasksCompleted: 0
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: '' });
    setShowAddMember(false);
    alert(`${newMember.name} added to the team!`);
  };

  const handleAssignTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      alert('Please fill task title and assign to someone');
      return;
    }

    const task = {
      id: Date.now(),
      ...newTask,
      assignedBy: user?.email,
      status: 'pending'
    };

    setAssignedTasks([...assignedTasks, task]);
    
    // Update member's task count
    setTeamMembers(teamMembers.map(member => 
      member.email === newTask.assignedTo 
        ? { ...member, tasksAssigned: member.tasksAssigned + 1 }
        : member
    ));

    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
    setShowAssignTask(false);
    alert(`Task "${newTask.title}" assigned to ${newTask.assignedTo}!`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck className="text-green-500" />;
      case 'in-progress': return <FaClock className="text-yellow-500" />;
      default: return <FaTasks className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FaUserPlus size={16} />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => setShowAssignTask(!showAssignTask)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FaPaperPlane size={16} />
              <span>Assign Task</span>
            </button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <FaTasks className="text-3xl text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Tasks Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{assignedTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <FaCheck className="text-3xl text-green-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{assignedTasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <FaClock className="text-3xl text-yellow-600 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{assignedTasks.filter(t => t.status === 'pending').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Team Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Role (e.g., Developer, Designer)"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddMember}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddMember(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Assign Task Form */}
        {showAssignTask && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Assign New Task</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Team Member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.email}>{member.name} ({member.email})</option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAssignTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaPaperPlane size={16} />
                <span>Assign Task</span>
              </button>
              <button
                onClick={() => setShowAssignTask(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FaUsers className="mr-2 text-blue-600" />
              Team Members
            </h3>
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tasks: {member.tasksAssigned}</p>
                      <p className="text-sm text-green-600">Completed: {member.tasksCompleted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <FaTasks className="mr-2 text-green-600" />
              Assigned Tasks
            </h3>
            <div className="space-y-4">
              {assignedTasks.map(task => (
                <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    {getStatusIcon(task.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Assigned to: {task.assignedTo}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamManagement;
