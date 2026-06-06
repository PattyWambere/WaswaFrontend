import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';

export const History: React.FC = () => {
    const [history, setHistory] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/user/history').then(res => {
            setHistory(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading history...</div>;

    const getExplorerUrl = (tx: Transaction) => {
        if (!tx.txHash) return null;
        if (tx.network === 'TRC20') return `https://tronscan.org/#/transaction/${tx.txHash}`;
        return `https://etherscan.io/tx/${tx.txHash}`;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Transaction History</h2>
                <p className="text-slate-400 mt-1">Full record of your account activity</p>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-slate-500 text-sm">
                                <th className="pb-3 font-medium">Type</th>
                                <th className="pb-3 font-medium">Asset/Network</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Hash</th>
                                <th className="pb-3 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {history.map((tx) => (
                                <tr key={tx._id} className="group hover:bg-white/[0.02] transition-colors">
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
                                    <td className="py-4">
                                        <div className="text-slate-200">{tx.asset}</div>
                                        <div className="text-xs text-slate-500 uppercase">{tx.network}</div>
                                    </td>
                                    <td className="py-4 text-white font-mono">
                                        {tx.type === 'withdrawal' ? (
                                            <div className="flex flex-col">
                                                <span>{tx.amount}</span>
                                                {(tx.fee ?? 0) > 0 && <span className="text-xs text-error">-{tx.fee} Fee</span>}
                                                {(tx.fee ?? 0) > 0 && <span className="text-xs text-success font-bold">= {tx.amountReceived} Rcvd</span>}
                                            </div>
                                        ) : (
                                            tx.amount
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${tx.status === 'completed' || tx.status === 'approved' ? 'bg-success/10 text-success' :
                                                tx.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        {tx.txHash ? (
                                            <a
                                                href={getExplorerUrl(tx) || '#'}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors text-xs font-mono"
                                            >
                                                {tx.txHash.substring(0, 10)}... <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-slate-600 italic text-xs">Processing...</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-slate-500 text-sm text-right">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-500">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
