import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Balance, Transaction } from '../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Gift, Users, Copy, Share2, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [balances, setBalances] = useState<Balance[]>([]);
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [referralInfo, setReferralInfo] = useState<{
        referralCode: string;
        referralLink: string;
        referralBonus: number;
        referralCount: number;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                try {
                    const balRes = await api.get('/user/balances');
                    setBalances(balRes.data);
                } catch (err) {
                    console.error('Failed to fetch balances', err);
                }

                try {
                    const histRes = await api.get('/user/history');
                    setHistory(histRes.data.slice(0, 5));
                } catch (err) {
                    console.error('Failed to fetch transaction history', err);
                }

                try {
                    const refRes = await api.get('/user/referral-info');
                    setReferralInfo(refRes.data);
                } catch (err) {
                    console.error('Failed to fetch referral info', err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCopy = () => {
        if (referralInfo?.referralLink) {
            navigator.clipboard.writeText(referralInfo.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleShare = async () => {
        if (navigator.share && referralInfo) {
            try {
                await navigator.share({
                    title: 'Join CrossTradeX',
                    text: `Join CrossTradeX using my referral code ${referralInfo.referralCode}!`,
                    url: referralInfo.referralLink,
                });
            } catch {
                handleCopy();
            }
        } else {
            handleCopy();
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Welcome back, {user?.fullName || 'User'}!</h2>
                    <p className="text-slate-400 mt-1">Here's what's happening with your assets today.</p>
                </div>
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" /> Your Balances
                </h3>
                <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <Link to="/deposit" className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base py-3">
                        <ArrowDownLeft className="w-4 h-4 shrink-0" /> <span className="truncate">Deposit</span>
                    </Link>
                    <Link to="/withdraw" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-3">
                        <ArrowUpRight className="w-4 h-4 shrink-0" /> <span className="truncate">Withdraw</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {balances.length > 0 ? balances.map((bal) => (
                    <div key={bal._id} className="card relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet className="w-20 h-20" />
                        </div>
                        <p className="text-slate-400 font-medium">{bal.asset} Balance</p>
                        <h3 className="text-4xl font-bold text-white mt-2">
                            {bal.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                        {bal.lockedAmount > 0 && (
                            <p className="text-sm text-warning mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {bal.lockedAmount} locked
                            </p>
                        )}
                    </div>
                )) : (
                    <div className="card col-span-3 text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Balances Yet</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            Make your first deposit to start managing your assets on CrossTradeX.
                        </p>
                        <Link to="/deposit" className="btn-primary mt-6 inline-block">Make a Deposit</Link>
                    </div>
                )}
            </div>

            {/* ── Referral Card ── */}
            {referralInfo && (
                <div className="card">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Gift className="w-5 h-5 text-primary" /> Refer &amp; Earn
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Share your link — earn a bonus when friends complete their first deposit</p>
                        </div>
                        {referralInfo.referralBonus > 0 && (
                            <Link
                                to="/security"
                                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid #22c55e', color: '#22c55e' }}
                            >
                                🎉 {referralInfo.referralBonus} USDT bonus ready → Redeem
                            </Link>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                        <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/40">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Your Code</p>
                            <p className="font-mono text-2xl font-black text-white tracking-widest">{referralInfo.referralCode}</p>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/40">
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Users className="w-3 h-3" /> Referred</p>
                            <p className="text-2xl font-black text-success">{referralInfo.referralCount}</p>
                        </div>
                        <div className={`rounded-xl p-4 text-center border ${
                            referralInfo.referralBonus > 0
                                ? 'bg-success/10 border-success/30'
                                : 'bg-slate-800/60 border-slate-700/40'
                        }`}>
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Pending Bonus</p>
                            <p className={`text-2xl font-black ${
                                referralInfo.referralBonus > 0 ? 'text-success' : 'text-slate-500'
                            }`}>{referralInfo.referralBonus} USDT</p>
                        </div>
                    </div>

                    {/* Link row */}
                    <div className="flex gap-3">
                        <div className="flex-1 bg-slate-800/60 border border-slate-700/40 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap select-all">
                            {referralInfo.referralLink}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="btn-secondary flex items-center gap-2 px-4 shrink-0"
                        >
                            {copied ? <CheckCheck className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={handleShare}
                            className="btn-primary flex items-center gap-2 px-4 shrink-0"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
            )}

            {/* Recent History */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                    <Link to="/history" className="text-primary text-sm font-medium hover:underline">View All</Link>
                </div>

                <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-slate-500 text-sm">
                                <th className="pb-3 px-2 font-medium">Type</th>
                                <th className="pb-3 px-2 font-medium">Asset</th>
                                <th className="pb-3 px-2 font-medium">Amount</th>
                                <th className="pb-3 px-2 font-medium">Status</th>
                                <th className="pb-3 px-2 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {history.map((tx) => (
                                <tr key={tx._id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'deposit' ? (
                                                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                                    <ArrowDownLeft className="w-4 h-4 text-success" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                                </div>
                                            )}
                                            <span className="capitalize text-white font-medium">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-slate-300">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{tx.asset}</span>
                                            <span className="text-xs text-slate-500">{tx.network}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-white font-mono">{tx.amount}</td>
                                    <td className="py-4 px-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-success/10 text-success' :
                                                tx.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-slate-500 text-sm text-right">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500">No recent transactions</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
