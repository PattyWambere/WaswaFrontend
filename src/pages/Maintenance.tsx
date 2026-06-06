import React from 'react';
import { Construction, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Maintenance: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                {/* Logo */}
                <div className="inline-flex w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4 shadow-2xl shadow-primary/20 border border-primary/20">
                    <Construction className="w-10 h-10 text-primary animate-bounce" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Under Maintenance
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        We're currently upgrading our systems to provide you with a better experience.
                        We'll be back online shortly!
                    </p>
                </div>

                <div className="card bg-slate-800/50 border-slate-700/50 backdrop-blur-xl p-8 space-y-6">

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="btn-secondary w-full py-3 flex items-center justify-center gap-2 border border-slate-600/50"
                        >
                            <LogOut className="w-5 h-5" />
                            Return to Login
                        </button>
                        <a
                            href="mailto:support@crosstradex.com"
                            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-600/50 group"
                        >
                            <Mail className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="font-medium">Contact Support</span>
                        </a>
                    </div>
                </div>


                <p className="text-xs text-slate-600 italic">
                    Thank you for your patience as we build the future of cross-chain custodial assets.
                </p>
            </div>
        </div>
    );
};
