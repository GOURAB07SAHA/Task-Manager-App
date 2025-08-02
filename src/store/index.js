// Central store exports
export { TaskProvider, useTaskStore, TASK_ACTIONS } from './TaskStore';
export { NotificationProvider, useNotificationStore } from './NotificationStore';
export { AppProvider, useAppStore } from './AppStore';

// Combined store provider
import React from 'react';
import { TaskProvider } from './TaskStore';
import { NotificationProvider } from './NotificationStore';
import { AppProvider } from './AppStore';

export const StoreProvider = ({ children }) => {
  return (
    <AppProvider>
      <NotificationProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </NotificationProvider>
    </AppProvider>
  );
};
