import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { 
    Download, XCircle, BadgeCheck, Copy, ShieldAlert, ArrowLeft, Loader2
} from 'lucide-react';

export const AdminDepositDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deposit, setDeposit] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeposit = async () => {
            try {
                const res = await api.get(`/admin/deposits/${id}`);
                setDeposit(res.data);
            } catch (err) {
                console.error(err);
                alert('Deposit not found');
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };
        fetchDeposit();
    }, [id, navigate]);

    const handleApprove = async () => {
        try {
            await api.post(`/admin/deposits/${id}/approve`);
            alert('Deposit approved successfully');
            navigate('/admin');
        } catch (err) {
            alert('Failed to approve');
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Are you sure you want to reject this deposit?')) return;
        try {
            await api.post(`/admin/deposits/${id}/reject`);
            alert('Deposit rejected');
            navigate('/admin');
        } catch (err) {
            alert('Failed to reject');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!deposit) return null;

    const userEmail = deposit.userId?.email || 'Unknown User';

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin')} className="p-2 bg-dark border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
                    <Download className="w-8 h-8 text-primary" /> Deposit Verification Details
                </h2>
            </div>

            <div className="card space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-dark-lighter p-5 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">User Email</p>
                        <p className="font-mono text-white text-lg truncate">{userEmail}</p>
                    </div>
                    <div className="bg-dark-lighter p-5 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Amount / Asset</p>
                        <p className="font-extrabold text-white text-2xl">{deposit.amount} <span className="text-primary">{deposit.asset}</span></p>
                    </div>
                    <div className="bg-dark-lighter p-5 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Network</p>
                        <p className="font-bold text-white text-lg">{deposit.network}</p>
                    </div>
                    <div className="bg-dark-lighter p-5 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Date Submitted</p>
                        <p className="font-medium text-slate-300 text-lg">{new Date(deposit.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-dark-lighter p-6 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Transaction Hash</p>
                    {deposit.txHash ? (
                        <div className="flex items-center gap-4 bg-dark p-4 rounded-lg border border-slate-700">
                            <a href={`https://tronscan.org/#/transaction/${deposit.txHash}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono break-all flex-1 text-base">
                                {deposit.txHash}
                            </a>
                            <button 
                                onClick={() => navigator.clipboard.writeText(deposit.txHash)}
                                className="p-2 bg-slate-800 hover:bg-primary/20 text-slate-400 hover:text-primary rounded-lg transition-colors flex items-center justify-center"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    ) : <p className="text-slate-500 italic">No transaction hash provided</p>}
                </div>

                <div className="bg-dark-lighter p-6 rounded-xl border border-slate-700/50 hover:border-primary/30 transition-colors">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Screenshot Proof</p>
                    {deposit.proofImageUrl ? (
                        <a href={deposit.proofImageUrl} target="_blank" rel="noreferrer" className="block group relative bg-dark rounded-xl p-2 border border-slate-700 hover:border-primary transition-all">
                            <img src={deposit.proofImageUrl} alt="Proof" className="w-full max-h-[600px] object-contain rounded-lg" />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <span className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-2xl scale-95 group-hover:scale-100 transition-transform">Open Full Size in New Tab</span>
                            </div>
                        </a>
                    ) : (
                        <div className="bg-dark p-12 rounded-xl border-2 border-slate-700 border-dashed flex flex-col items-center justify-center text-center">
                            <ShieldAlert className="w-16 h-16 text-slate-600 mb-4" />
                            <p className="text-slate-400 font-medium">No screenshot uploaded for this deposit</p>
                        </div>
                    )}
                </div>

                {deposit.status === 'pending' && (
                    <div className="flex gap-6 mt-10 pt-8 border-t border-slate-700/50">
                        <button onClick={handleApprove} className="flex-1 bg-success hover:bg-success/80 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1 text-lg">
                            <BadgeCheck className="w-7 h-7" /> Approve Deposit
                        </button>
                        <button onClick={handleReject} className="flex-1 bg-dark hover:bg-error/20 text-error border border-error/50 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 text-lg">
                            <XCircle className="w-7 h-7" /> Reject Deposit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
