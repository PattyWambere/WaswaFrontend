import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Mail, Lock, Loader2, AlertCircle, User as UserIcon, Phone, ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard');
        } catch (err: any) {
            if (err.response?.data?.error === 'unverified_email') {
                navigate('/register', { state: { email, step: 'verify' } });
            } else {
                setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                
                <div className="text-center mb-10">
                    <div className="mb-4">
                        <span className="text-4xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Manage your TRC20 USDT with ease</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex items-center gap-3 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    className="input-field w-full pl-10"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
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

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-white transition-colors">
                            Forgot your password?
                        </Link>
                    </div>

                    <p className="text-center text-slate-400 mt-8 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="text-center mb-10">
                    <div className="mb-4">
                        <span className="text-4xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-400 mt-2">Enter your email to receive a reset link</p>
                </div>

                <div className="card">
                    {success ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                                <Mail className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">Check your email</h3>
                                <p className="text-slate-400">We've sent a password reset link to <span className="text-white font-medium">{email}</span></p>
                            </div>
                            <Link to="/login" className="btn-primary w-full py-3 inline-block">
                                Back to Login
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
                                <label className="label">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                    <input
                                        type="email"
                                        required
                                        className="input-field w-full pl-10"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </button>

                            <p className="text-center">
                                <Link to="/login" className="text-sm text-slate-500 hover:text-white transition-colors">
                                    Back to Login
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Register: React.FC = () => {
    const location = useLocation();
    const [step, setStep] = useState<'register' | 'verify'>(location.state?.step || 'register');
    const [otp, setOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(location.state?.email || '');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCooldown > 0) {
            timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', {
                fullName,
                email,
                phoneNumber,
                password,
                role: 'user'
            });
            setStep('verify');
            setResendCooldown(60);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/verify-email', { email, otp });
            login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/resend-otp', { email });
            setResendCooldown(60);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4 py-12">
            <div className="max-w-md w-full">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="text-center mb-10">
                    <div className="mb-4">
                        <span className="text-4xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-slate-400 mt-2">Start your custodial journey today</p>
                </div>

                <div className="card">
                    {step === 'register' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="label">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full pl-10"
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                                        <input
                                            type="email"
                                            required
                                            className="input-field w-full pl-10"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Phone Number (Optional)</label>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Password</label>
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
                                        <label className="label">Confirm Password</label>
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
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            {error && (
                                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}
                            
                            <div className="text-center mb-6">
                                <p className="text-slate-400">We've sent a 6-digit verification code to <span className="text-white font-medium">{email}</span></p>
                            </div>

                            <div>
                                <label className="label text-center">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="input-field w-full text-center text-2xl tracking-widest font-mono py-4"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            <button
                                disabled={loading || otp.length !== 6}
                                type="submit"
                                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || loading}
                                    className="text-sm text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-slate-400 mt-8 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
