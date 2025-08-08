
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Check, Info } from 'lucide-react';

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: idCounter,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setIdCounter(prev => prev + 1);
    setNotifications(prev => [newNotification, ...prev]);
  }, [idCounter]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
