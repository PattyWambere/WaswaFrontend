import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Balance, Transaction } from '../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [balances, setBalances] = useState<Balance[]>([]);
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</h2>
                    <p className="text-slate-400 mt-1">Here's what's happening with your assets today.</p>
                </div>
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" /> Your Balances
                </h3>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link to="/deposit" className="btn-secondary flex items-center justify-center gap-2 flex-1 sm:flex-none">
                        <ArrowDownLeft className="w-4 h-4" /> Deposit
                    </Link>
                    <Link to="/withdraw" className="btn-primary flex items-center justify-center gap-2 flex-1 sm:flex-none">
                        <ArrowUpRight className="w-4 h-4" /> Withdraw
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

            {/* Recent History */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                    <Link to="/history" className="text-primary text-sm font-medium hover:underline">View All</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Type</th>
                                <th className="pb-3 font-medium">Asset</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {history.map((tx) => (
                                <tr key={tx._id} className="group">
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'deposit' ? (
                                                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                                                    <ArrowDownLeft className="w-4 h-4 text-success" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                                </div>
                                            )}
                                            <span className="capitalize text-white font-medium">{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-slate-300">{tx.asset} / {tx.network}</td>
                                    <td className="py-4 text-white font-mono">{tx.amount}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-success/10 text-success' :
                                                tx.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-500 text-sm text-right">
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
