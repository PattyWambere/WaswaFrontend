import React, { useState, useEffect } from 'react';
import { User, Phone, Loader2, CheckCircle, User as UserIcon } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const ProfileForm: React.FC = () => {
    const { user, login } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data } = await api.put('/auth/profile', { fullName, phoneNumber });

            // Re-login with new data (updating the token/user state)
            // Note: Since back-end updateProfile doesn't return a new JWT, 
            // we should just update the user data in the context.
            // Our AuthContext login takes AuthResponse which includes token.
            // We can just manually patch the user in the context or re-fetch.
            // For simplicity, let's update the local storage and state manually if login() requires a token.

            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                login({ ...data, token: storedToken });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <UserIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Public Profile</h3>
                    <p className="text-sm text-slate-400">Update your account information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Profile updated successfully!
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input
                                type="text"
                                required
                                className="input-field w-full pl-10"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input
                                type="email"
                                disabled
                                className="input-field w-full pl-10 opacity-60 cursor-not-allowed"
                                value={user?.email || ''}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Email cannot be changed for security</p>
                    </div>

                    <div>
                        <label className="label">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input
                                type="tel"
                                className="input-field w-full pl-10"
                                placeholder="+1 (555) 000-0000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary rounded-none px-8 py-2.5 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
