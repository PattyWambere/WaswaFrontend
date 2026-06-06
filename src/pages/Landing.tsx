import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, ArrowRight, Wallet, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Landing: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-dark overflow-hidden font-sans text-slate-300">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-dark/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-white animate-text-shimmer" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>
                                CrossTradeX
                            </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors">
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors px-2 sm:px-4 py-2 text-sm sm:text-base hidden xs:block">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-sm sm:text-base">
                                Get Started <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-dark/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
                </div>

                {/* Floating Currency Symbols */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
                    <div className="absolute top-[20%] left-[10%] animate-bounce opacity-30 text-amber-500" style={{ animationDuration: '4s' }}>
                        <span className="text-7xl font-sans drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">₿</span>
                    </div>
                    <div className="absolute top-[40%] right-[15%] animate-bounce opacity-30 text-blue-400" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                        <span className="text-8xl font-sans drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">Ξ</span>
                    </div>
                    <div className="absolute bottom-[20%] left-[20%] animate-bounce opacity-30 text-success" style={{ animationDuration: '6s', animationDelay: '2s' }}>
                        <span className="text-6xl font-sans drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">$</span>
                    </div>
                    <div className="absolute top-[15%] right-[35%] animate-pulse opacity-20 text-emerald-400" style={{ animationDuration: '4s' }}>
                        <span className="text-5xl font-sans drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">₮</span>
                    </div>
                    <div className="absolute bottom-[30%] right-[25%] animate-bounce opacity-30 text-purple-400" style={{ animationDuration: '7s', animationDelay: '3s' }}>
                        <span className="text-6xl font-sans drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]">£</span>
                    </div>
                    <div className="absolute top-[60%] left-[30%] animate-pulse opacity-20 text-rose-400" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>
                        <span className="text-5xl font-sans drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]">¥</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        CrossTradeX v2.0 is Live
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 sm:mb-8 animate-in mt-2 fade-in slide-in-from-bottom-6 duration-700 delay-100 px-2 sm:px-0 leading-tight">
                        Secure Custody for the <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary-light animate-text-shimmer">
                            DeFi Generation
                        </span>
                    </h1>

                    <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-slate-400 leading-relaxed mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 px-4 sm:px-0">
                        Institutional-grade asset management platform combining military-grade security with a seamless cross-chain experience.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 px-4 sm:px-0">
                        <Link to="/register" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 w-full sm:w-auto">
                            Open Free Account <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#features" className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white rounded-xl font-bold transition-all flex items-center justify-center w-full sm:w-auto">
                            Explore Features
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-16 sm:py-24 bg-slate-900/50 border-y border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-white animate-text-shimmer mb-4">Why choose CrossTradeX?</h2>
                        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">Built from the ground up to provide the ultimate balance of security, transparency, and ease of use.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        <div className="card bg-dark/50 hover:bg-slate-800/50 transition-colors border-slate-800 group">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <Lock className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Your digital assets are protected by industry-leading cryptographic security and isolated cold storage architectures.
                            </p>
                        </div>

                        <div className="card bg-dark/50 hover:bg-slate-800/50 transition-colors border-slate-800 group">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Globe className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Multi-Chain Ecosystem</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Seamlessly manage assets across multiple networks including TRON, Ethereum, and Binance Smart Chain from a single dashboard.
                            </p>
                        </div>

                        <div className="card bg-dark/50 hover:bg-slate-800/50 transition-colors border-slate-800 group">
                            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6 border border-success/20 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-7 h-7 text-success" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast Execution</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Automated processing ensures your deposits and withdrawals are executed with minimal latency and maximum reliability.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">$500K+</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">Volume</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">1,200+</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">99.9%</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">Uptime</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">24/7</p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 sm:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to secure your portfolio?</h2>
                    <p className="text-lg sm:text-xl text-slate-400 mb-8 sm:mb-10">Join thousands of users who trust CrossTradeX with their digital assets.</p>
                    <Link to="/register" className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 flex sm:inline-flex items-center justify-center gap-3 w-full sm:w-auto">
                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6" /> Start Building Your Wealth
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50">
                        <span className="text-xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif", letterSpacing: "1px" }}>CrossTradeX</span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} CrossTradeX. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-slate-500">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
