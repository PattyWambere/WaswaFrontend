import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="mb-4">
                        <span className="text-4xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">New Password</h1>
                    <p className="text-slate-400 mt-2">Create a secure password for your account</p>
                </div>

                <div className="card">
                    {success ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Password Reset!</h3>
                                <p className="text-slate-400">Your password has been updated. Redirecting you to login...</p>
                            </div>
                            <Link to="/login" className="btn-primary w-full py-3 inline-block">
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="label">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <input
                                        type="password"
                                        required
                                        className="input-field w-full pl-10"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Updating password...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
