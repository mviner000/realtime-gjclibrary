"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Notification, NotificationResponse } from '@/types';

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: number) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const NOTIFICATIONS_URL = "/api/notifications";

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get<NotificationResponse>('/api/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const formData = new FormData();
            await axios.post(`${NOTIFICATIONS_URL}/${notificationId}`, formData);

            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif.id === notificationId ? { ...notif, read_at: new Date().toISOString() } : notif
                )
            );
            setUnreadCount(prevCount => prevCount - 1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};