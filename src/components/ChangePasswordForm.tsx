import React, { useState } from 'react';
import { Lock, Loader2, CheckCircle, ShieldAlert, Shield } from 'lucide-react';
import api from '../api/api';

const ChangePasswordForm: React.FC = () => {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/auth/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Update Password</h3>
                    <p className="text-sm text-slate-400">Keep your account secure with a strong password</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="label">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                            <input
                                type="password"
                                required
                                className="input-field w-full pl-10"
                                placeholder="••••••••"
                                value={passwords.oldPassword}
                                onChange={e => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    className="input-field w-full pl-10"
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    className="input-field w-full pl-10"
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary rounded-none px-8 py-2.5 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
