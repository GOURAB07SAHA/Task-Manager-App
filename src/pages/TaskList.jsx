import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import TaskStats from '../components/TaskStats';
import TaskAssignment from '../components/TaskAssignment';
import { loadTasks, saveTasks } from '../utils/localStorage';

const TaskList = () => {
  const [tasks, setTasks] = useState(loadTasks());

  const [isFormVisible, setFormVisible] = useState(false);
  const [editableTask, setEditableTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const editTask = (task) => {
    setEditableTask(task);
    setFormVisible(true);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const saveTask = (task) => {
    if (editableTask) {
      const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    } else {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      saveTasks(newTasks);
    }
    setFormVisible(false);
    setEditableTask(null);
  };

  const handleCancel = () => {
    setFormVisible(false);
    setEditableTask(null);
  };

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'high' || filter === 'medium' || filter === 'low') {
      return task.priority === filter;
    }
    return true;
  });

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <TaskStats tasks={tasks} />
      <TaskAssignment />
      <button onClick={() => setFormVisible(true)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add New Task
      </button>
      <TaskFilter filter={filter} onFilterChange={setFilter} />
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks found.</p>
      ) : (
        filteredTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={toggleComplete}
          onEdit={editTask}
          onDelete={deleteTask}
        />
        ))
      )}
      {isFormVisible && (
        <TaskForm task={editableTask} onSave={saveTask} onCancel={handleCancel} />
      )}
    </Layout>
  );
};

export default TaskList;

