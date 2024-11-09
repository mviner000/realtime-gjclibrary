"use client";

import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { CheckIcon, Loader, OctagonAlert } from 'lucide-react';
import Link from 'next/link';

const NotificationsPage = () => {
    const { notifications, markAsRead } = useNotifications();
    const [loadingNotificationId, setLoadingNotificationId] = useState<number | null>(null);
    const [loadingLinkId, setLoadingLinkId] = useState<number | null>(null);

    const handleMarkAsRead = async (id: number) => {
        setLoadingNotificationId(id);
        await markAsRead(id);
        setLoadingNotificationId(null);
    };

    const handleLinkClick = async (id: number) => {
        setLoadingLinkId(id);
        await markAsRead(id);
        // Simulate loading for 1 second
        setTimeout(() => setLoadingLinkId(null), 1000);
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length === 0 ? (
                <p>No notifications to display.</p>
            ) : (
                <ul className="space-y-4 text-black">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`p-4 shadow rounded-lg flex justify-between items-center ${!notification.read_at ? 'bg-transparent text-slate-200 font-semibold outline outline-1 outline-red-500' : 'bg-white'
                                }`}
                        >
                            <div>
                                <div className={`${!notification.read_at ? 'text-slate-200 font-bold' : 'bg-white'
                                    }`}>
                                    <p className='flex gap-1'>
                                        <span className=''>
                                            {!notification.read_at ? <OctagonAlert /> : <CheckIcon />}
                                        </span>
                                        Notif #{notification.id}</p>
                                </div>
                                <p>{notification.message}</p>
                                {/* <p className="text-sm text-gray-500 mt-2">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p> */}

                                {/* Link for quotes */}
                                {notification.content_type === "quote" && (
                                    <Link
                                        href={`/quotes/${notification.quote_id}`}
                                        onClick={() => handleLinkClick(notification.id)}
                                        className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                                    >
                                        {loadingLinkId === notification.id ? (
                                            <Loader className="animate-spin inline-block mr-2" size={16} />
                                        ) : (
                                            'View Quote'
                                        )}
                                    </Link>
                                )}

                                {/* Link for book card photo */}
                                {notification.content_type === "book_card_photo" && (
                                    <Link
                                        href={`/student/${notification.book_card_id}`}
                                        onClick={() => handleLinkClick(notification.id)}
                                        className={`text-sm hover:underline mt-2 inline-block ${!notification.read_at ? 'text-slate-100 p-1 rounded-md bg-transparent hover:bg-sky-500 outline outline-1 outline-green-500' : 'text-blue-500'
                                            }`}
                                    >
                                        {loadingLinkId === notification.id ? (
                                            <Loader className="animate-spin inline-block mr-2" size={16} />
                                        ) : (
                                            `View Book Card Photo - ${notification.book_card_id}`
                                        )}
                                    </Link>
                                )}
                            </div>

                            {!notification.read_at && (
                                <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="text-sm p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-slate-100 hover:underline flex items-center"
                                    disabled={loadingNotificationId === notification.id}
                                >
                                    {loadingNotificationId === notification.id ? (
                                        <Loader className="animate-spin mr-2" size={16} />
                                    ) : (
                                        'Mark as read'
                                    )}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};

export default NotificationsPage;