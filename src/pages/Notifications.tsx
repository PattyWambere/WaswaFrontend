import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Check } from 'lucide-react';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    read: boolean;
    createdAt: string;
}

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/user/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/user/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/user/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-6 h-6 text-success" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-warning" />;
            case 'error': return <XCircle className="w-6 h-6 text-error" />;
            default: return <Info className="w-6 h-6 text-primary" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Bell className="w-6 h-6 text-primary" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-primary text-dark text-xs font-bold px-2 py-1 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </h2>
                    <p className="text-slate-400 mt-1">Stay updated on your account activity</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllAsRead}
                        className="btn-secondary text-sm flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="card text-center py-16 text-slate-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification._id}
                            onClick={() => !notification.read && markAsRead(notification._id)}
                            className={`card flex gap-4 transition-all ${
                                !notification.read 
                                    ? 'border-primary/50 shadow-[0_0_15px_rgba(56,189,248,0.1)] cursor-pointer hover:border-primary' 
                                    : 'opacity-75'
                            }`}
                        >
                            <div className="shrink-0 mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <h4 className={`font-bold ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className={`mt-1 text-sm ${!notification.read ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {notification.message}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="shrink-0 flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
