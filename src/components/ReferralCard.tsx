import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Gift, Copy, CheckCheck, Loader2, CheckCircle } from 'lucide-react';

const ReferralCard: React.FC = () => {
    const [info, setInfo] = useState<{
        referralCode: string;
        referralLink: string;
        referralBonus: number;
        referralCount: number;
    } | null>(null);
    const [copied, setCopied] = useState(false);
    const [redeeming, setRedeeming] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchInfo = async () => {
        try {
            const res = await api.get('/user/referral-info');
            setInfo(res.data);
        } catch (err) {
            console.error('Failed to fetch referral info', err);
        }
    };

    useEffect(() => { fetchInfo(); }, []);

    const handleCopy = () => {
        if (info?.referralLink) {
            navigator.clipboard.writeText(info.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleRedeem = async () => {
        setRedeeming(true);
        setMessage('');
        setError('');
        try {
            const res = await api.post('/user/redeem-bonus');
            setMessage(res.data.message);
            await fetchInfo(); // refresh bonus to 0
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to redeem bonus');
        } finally {
            setRedeeming(false);
        }
    };

    if (!info) return null;

    return (
        <div className="card max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Gift className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Referral Program</h3>
                    <p className="text-sm text-slate-400">Invite friends and earn bonuses when they deposit</p>
                </div>
            </div>

            {message && (
                <div className="bg-success/10 border border-success/20 text-success p-4 rounded-lg flex items-center gap-2 text-sm mb-4">
                    <CheckCircle className="w-4 h-4 shrink-0" /> {message}
                </div>
            )}
            {error && (
                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/40">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Your Code</p>
                    <p className="font-mono text-xl font-black text-white tracking-widest">{info.referralCode}</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/40">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Friends Referred</p>
                    <p className="text-xl font-black text-success">{info.referralCount}</p>
                </div>
                <div className={`rounded-xl p-4 text-center border ${
                    info.referralBonus > 0 ? 'bg-success/10 border-success/30' : 'bg-slate-800/60 border-slate-700/40'
                }`}>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Pending Bonus</p>
                    <p className={`text-xl font-black ${info.referralBonus > 0 ? 'text-success' : 'text-slate-500'}`}>
                        {info.referralBonus} USDT
                    </p>
                </div>
            </div>

            {/* Link */}
            <div className="mb-4">
                <p className="label mb-2">Your Referral Link</p>
                <div className="flex gap-3">
                    <div className="flex-1 bg-slate-800/60 border border-slate-700/40 rounded-lg px-4 py-2.5 font-mono text-sm text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap select-all">
                        {info.referralLink}
                    </div>
                    <button onClick={handleCopy} className="btn-secondary rounded-none flex items-center gap-2 px-4 shrink-0">
                        {copied ? <CheckCheck className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Redeem */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
                info.referralBonus > 0 ? 'bg-success/10 border-success/30' : 'bg-slate-800/60 border-slate-700/40'
            }`}>
                <div>
                    <p className="text-white font-semibold">Redeem Bonus</p>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {info.referralBonus > 0
                            ? `Transfer ${info.referralBonus} USDT into your main balance`
                            : 'No bonus available yet — bonuses are added after your referrals deposit'
                        }
                    </p>
                </div>
                <button
                    onClick={handleRedeem}
                    disabled={redeeming || info.referralBonus <= 0}
                    className="btn-primary rounded-none flex items-center gap-2 px-5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {redeeming && <Loader2 className="w-4 h-4 animate-spin" />}
                    {redeeming ? 'Redeeming...' : 'Redeem'}
                </button>
            </div>
        </div>
    );
};

export default ReferralCard;
