import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User as UserIcon, ArrowLeft, Sun, Moon, Bell } from 'lucide-react';
import { MdDashboard, MdShowChart, MdFileDownload, MdFileUpload, MdHistory, MdSettings } from 'react-icons/md';
import api from '../api/api';

export const PrivateRoute: React.FC<{ children?: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export const AppLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        { label: 'Dashboard', icon: MdDashboard, path: '/dashboard', roles: ['user', 'admin'] },
        { label: 'Trading', icon: MdShowChart, path: '/trading', roles: ['user', 'admin'] },
        { label: 'Deposit', icon: MdFileDownload, path: '/deposit', roles: ['user', 'admin'] },
        { label: 'Withdraw', icon: MdFileUpload, path: '/withdraw', roles: ['user', 'admin'] },
        { label: 'History', icon: MdHistory, path: '/history', roles: ['user', 'admin'] },
        { label: 'Admin Panel', icon: MdSettings, path: '/admin', roles: ['admin'] },
    ];

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            api.get('/user/notifications/unread-count')
                .then(res => setUnreadCount(res.data.count))
                .catch(console.error);
        }
    }, [location.pathname, user]);

    return (
        <div className="flex min-h-screen bg-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-lighter border-r border-slate-700/50 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        item.roles.includes(user?.role || 'user') && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all group"
                            >
                                <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700/50">
                    <Link
                        to="/security"
                        className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-dark/50 border border-slate-700/30 hover:border-primary/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-primary/30">
                            <UserIcon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.fullName || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            <p className="text-[10px] text-primary font-bold uppercase mt-0.5">{user?.role}</p>
                        </div>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all group mb-2"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 group-hover:text-warning" /> : <Moon className="w-5 h-5 group-hover:text-primary" />}
                        <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative h-screen overflow-hidden">
                <header className="h-16 bg-dark border-b border-slate-700/50 flex items-center justify-between px-4 sm:px-6 shrink-0">
                    <div className="flex items-center md:hidden gap-3">
                        {location.pathname !== '/dashboard' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            <span style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                        </h1>
                    </div>
                    {/* Empty div for desktop to push the icons to the right if we wanted, but justify-between handles it */}
                    <div className="hidden md:block"></div>
                    {/* Header Icons */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-dark"></span>
                            )}
                        </Link>
                        <div className="md:hidden flex items-center gap-2">
                            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white">
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link to="/security" className="p-2 text-slate-400 hover:text-white">
                                <UserIcon className="w-5 h-5" />
                            </Link>
                            <button onClick={logout} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-10">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-slate-700/50 flex justify-around items-center px-2 py-2 z-50 safe-area-pb">
                {navItems.map((item) => {
                    if (!item.roles.includes(user?.role || 'user')) return null;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center gap-1 min-w-[64px] transition-colors ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <div className={`px-4 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/20 scale-110' : 'scale-100'}`}>
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
