"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { Notification } from '@/types'; // Adjust the path if needed

const NotificationDetails = () => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const pathname = usePathname();  // Get the pathname

    // Extract the `id` from the pathname (assuming the URL structure is /notifications/details/[id])
    const id = pathname.split('/').pop();

    useEffect(() => {
        const fetchNotificationDetails = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/notifications/details/${id}`);
                    const data: Notification = await response.json();
                    setNotification(data);
                } catch (error) {
                    console.error('Error fetching notification details:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotificationDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!notification) {
        return <div className="p-4">Notification not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold mb-4">
                {notification.inapp_title || notification.email_subject || "Notification"}
            </h1>
            <div className="mb-4 text-gray-600">
                <p>Date: {new Date(notification.created_at).toLocaleString()}</p>
                <p>Type: {notification.notification_type}</p>
                <p>Sent to: {notification.user_username}</p>
                {notification.read_at && (
                    <p>Read at: {new Date(notification.read_at).toLocaleString()}</p>
                )}
            </div>
            <div className="border-t pt-4">
                {notification.notification_type === 'email' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">Subject: {notification.email_subject}</h2>
                        <p className="whitespace-pre-wrap">{notification.email_body}</p>
                    </>
                )}
                {notification.notification_type === 'in_app' && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">{notification.inapp_title}</h2>
                        <p className="whitespace-pre-wrap">{notification.inapp_body}</p>
                    </>
                )}
                {notification.notification_type === 'sms' && (
                    <p className="whitespace-pre-wrap">{notification.sms_message}</p>
                )}
            </div>
        </div>
    );
};

export default NotificationDetails;
