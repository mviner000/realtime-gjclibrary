"use client"

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/contexts/NotificationsContext';
import useClickOutside from '@/hooks/useClickOutside';
import Link from 'next/link';

const NotifsToggle: React.FC = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();

    const closeDropdown = () => setIsOpen(false);
    const dropdownRef = useClickOutside(closeDropdown);

    const toggleDropdown = () => {
        if (window.innerWidth <= 768) {
            router.push('/notifications');
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleShowAll = () => {
        router.push('/notifications');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center">
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && window.innerWidth > 768 && (
                <div className="absolute right-0 mt-2 w-96 bg-white text-black shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                        <ul className="space-y-2">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500">No Notifications Yet</p>
                            ) : (
                                <ul className="space-y-2">
                                    {notifications.slice(0, 6).map((notification) => (
                                        <li
                                            key={notification.id}
                                            className={`cursor-pointer p-2 rounded flex justify-between items-center ${!notification.read_at ? 'bg-emerald-500/50 font-semibold' : 'hover:bg-gray-100'
                                                }`}
                                        >

                                            <Link href="/notifications" className='pt-2'>
                                                <span>{notification.message} {!notification.read_at && (

                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="pt-8 right-8 top-6 absolute text-right text-xs text-blue-500 hover:underline"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ul>
                    </div>
                    <div className="border-t p-2 flex justify-between">
                        <button onClick={handleShowAll} className="text-blue-500 hover:underline">
                            Show all
                        </button>
                        <button onClick={closeDropdown} className="text-gray-500 hover:underline">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotifsToggle;