import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Transaction, Asset, Network, WalletSettings, Balance, AppSettings } from '../types';
import { 
    ShieldCheck, ShieldAlert, BadgeCheck, XCircle, RefreshCw, Loader2, Download, Upload, CircleAlert,
    Copy, Eye
} from 'lucide-react';
import { LivePnL } from '../components/LivePnL';



export const AdminDashboard: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [walletSettings, setWalletSettings] = useState<WalletSettings[]>([]);
    const [pendingDeposits, setPendingDeposits] = useState<Transaction[]>([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState<Transaction[]>([]);
    const [balances, setBalances] = useState<Balance[]>([]);
    const [balanceSearch, setBalanceSearch] = useState('');
    const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'config' | 'balances' | 'trading' | 'signals' | 'referrals'>('pending');
    const [referrals, setReferrals] = useState<any[]>([]);
    const [bonusAmounts, setBonusAmounts] = useState<{ [key: string]: string }>({});
    const [referralMessage, setReferralMessage] = useState('');
    const [pendingSettlements, setPendingSettlements] = useState<any[]>([]);
    const [signals, setSignals] = useState<any[]>([]);
    const [isAddingSignal, setIsAddingSignal] = useState(false);
    const [newSignal, setNewSignal] = useState({
        symbol: '',
        startTime: '',
        endTime: '',
        entryPrice: 0,
        profitPercentage: 0.005,
        side: 'buy' as 'buy' | 'sell',
        type: 'daily' as 'daily' | 'bonus',
        timeSlot: '12:30' as '12:30' | '14:30'
    });
    const navigate = useNavigate();

    // Create Wallet State
    const [isAddingWallet, setIsAddingWallet] = useState(false);
    const [addingWalletLoading, setAddingWalletLoading] = useState(false);
    const [newWallet, setNewWallet] = useState({
        asset: '',
        network: '',
        centralWallet: '',
        file: null as File | null
    });

    const handleAddWallet = async () => {
        if (!newWallet.asset || !newWallet.network || !newWallet.centralWallet) {
            alert('Please fill all required fields');
            return;
        }

        setAddingWalletLoading(true);
        const formData = new FormData();
        formData.append('asset', newWallet.asset);
        formData.append('network', newWallet.network);
        formData.append('centralWallet', newWallet.centralWallet);
        formData.append('enabled', 'true');
        if (newWallet.file) {
            formData.append('qrCode', newWallet.file);
        }

        try {
            await api.post('/admin/wallet-settings', formData);
            setIsAddingWallet(false);
            setNewWallet({ asset: '', network: '', centralWallet: '', file: null });
            fetchData();
        } catch (err) {
            console.error('Failed to create wallet setting', err);
            const msg = (err as any).response?.data?.error || 'Failed to create wallet setting';
            alert(msg);
        } finally {
            setAddingWalletLoading(false);
        }
    };

    const fetchLiveUpdates = async () => {
        try {
            const [settleRes, signalsRes] = await Promise.all([
                api.get('/trades/pending-settlements'),
                api.get('/signals/admin')
            ]);
            setPendingSettlements(settleRes.data);
            setSignals(signalsRes.data);
        } catch (err) {
            console.error('Failed to fetch live updates', err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assetRes, netRes, walletRes, depRes, withRes, balRes, appRes, settleRes, signalsRes, refRes] = await Promise.all([
                api.get('/admin/assets'),
                api.get('/admin/networks'),
                api.get('/admin/wallet-settings'),
                api.get('/admin/deposits/pending'),
                api.get('/admin/withdrawals/pending'),
                api.get('/admin/balances'),
                api.get('/admin/app-settings'),
                api.get('/trades/pending-settlements'),
                api.get('/signals/admin'),
                api.get('/admin/referrals').catch(err => {
                    console.error('Failed to fetch referrals:', err);
                    return { data: [] };
                })
            ]);

            setAssets(assetRes.data);
            setNetworks(netRes.data);
            setWalletSettings(walletRes.data);
            setPendingDeposits(depRes.data);
            setPendingWithdrawals(withRes.data);
            setBalances(balRes.data);
            setAppSettings(appRes.data);
            setPendingSettlements(settleRes.data);
            setSignals(signalsRes.data);
            setReferrals(refRes.data);

            // Set default symbol if not set
            if (assetRes.data.length > 0) {
                setNewSignal(prev => ({ ...prev, symbol: prev.symbol || `${assetRes.data[0].symbol}/USDT` }));
            }
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Full refresh every 5 minutes (to keep all tabs updated slowly)
        const fullInterval = setInterval(fetchData, 300000);
        
        // Live updates (Signals & Settlements) every 5 seconds
        const liveInterval = setInterval(fetchLiveUpdates, 5000);
        
        return () => {
            clearInterval(fullInterval);
            clearInterval(liveInterval);
        };
    }, []);

    const handleApproveDeposit = async (id: string) => {
        if (!confirm('Are you sure you want to approve this deposit?')) return;
        try {
            await api.post(`/admin/deposits/${id}/approve`);
            fetchData();
        } catch (err) { alert('Failed to approve'); }
    };

    const handleApproveWithdrawal = async (id: string) => {
        if (!confirm('Confirm that the funds have been sent to the user?')) return;
        try {
            await api.post(`/admin/withdrawals/${id}/approve`, {});
            fetchData();
        } catch (err: any) { 
            alert(`Failed to approve: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleAddBonus = async (referredUserId: string) => {
        const amount = bonusAmounts[referredUserId];
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert('Please enter a valid positive bonus amount');
            return;
        }
        setReferralMessage('Adding bonus...');
        try {
            const res = await api.post(`/admin/referrals/${referredUserId}/bonus`, { amount: Number(amount) });
            setReferralMessage(res.data.message);
            setBonusAmounts(prev => ({ ...prev, [referredUserId]: '' }));
            fetchData();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Failed to add bonus';
            alert(errorMsg);
            setReferralMessage('');
        }
    };

    const toggleAsset = async (id: string, enabled: boolean) => {
        await api.put(`/admin/assets/${id}`, { enabled: !enabled });
        fetchData();
    };

    const getUserEmail = (user: any) => {
        if (!user) return 'Unknown';
        return typeof user === 'object' && user.email ? user.email : 'Unknown User';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-400">Loading administrative console...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-primary" /> Admin Panel
                    </h2>
                    <p className="text-slate-400 mt-1">System oversight and transaction management</p>
                </div>
                <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Refresh Data
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto whitespace-nowrap border-b border-slate-700/50 pb-px hide-scrollbar">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Pending Actions ({pendingDeposits.length + pendingWithdrawals.length})
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'config' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    System Config
                </button>
                <button
                    onClick={() => setActiveTab('balances')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'balances' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    All User Balances
                </button>
                <button
                    onClick={() => setActiveTab('trading')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'trading' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Manual Trade Settlement
                </button>
                <button
                    onClick={() => setActiveTab('signals')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'signals' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Signals
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === 'referrals' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Referrals ({referrals.length})
                </button>
            </div>

            {activeTab === 'pending' && (
                <div className="grid grid-cols-1 gap-8">
                    {/* Pending Deposits */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Download className="w-5 h-5 text-success" /> Pending Deposits
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                    <tr>
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Asset/Network</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Proof</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {pendingDeposits.map(dep => (
                                        <tr key={dep._id} onClick={() => navigate(`/admin/deposit/${dep._id}`)} className="cursor-pointer hover:bg-slate-800/50 transition-colors group">
                                            <td className="py-4 text-slate-200 pl-4">{getUserEmail(dep.userId)}</td>
                                            <td className="py-4 text-slate-400 text-sm">{dep.asset} / {dep.network}</td>
                                            <td className="py-4 text-white font-mono">{dep.amount}</td>
                                            <td className="py-4">
                                                <div className="space-y-1">
                                                    {dep.txHash ? (
                                                        <span className="text-primary text-xs font-mono truncate block max-w-[160px]">
                                                            {dep.txHash.slice(0,12)}...{dep.txHash.slice(-6)}
                                                        </span>
                                                    ) : <span className="text-slate-600 text-xs">No TX ID</span>}
                                                    {(dep as any).proofImageUrl && (
                                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Has Image</span>
                                                    )}
                                                    {!dep.txHash && !(dep as any).proofImageUrl && (
                                                        <span className="text-slate-600 text-xs italic">No proof yet</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-right pr-4">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/deposit/${dep._id}`); }} className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors" title="View Details">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleApproveDeposit(dep._id); }} className="p-2 bg-success/10 text-success hover:bg-success/20 rounded-lg transition-colors" title="Approve">
                                                        <BadgeCheck className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={async (e) => { e.stopPropagation(); if (confirm('Reject?')) await api.post(`/admin/deposits/${dep._id}/reject`); fetchData(); }} className="p-2 bg-error/10 text-error hover:bg-error/20 rounded-lg transition-colors" title="Reject">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingDeposits.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-500">No pending deposits</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pending Withdrawals */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" /> Pending Withdrawals
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                    <tr>
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Requested / Fee</th>
                                        <th className="pb-3">Amount to Send</th>
                                        <th className="pb-3">Destination Address</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {pendingWithdrawals.map(wit => (
                                        <tr key={wit._id}>
                                            <td className="py-4 text-slate-200">{getUserEmail(wit.userId)}</td>
                                            <td className="py-4 text-slate-400">
                                                <div>{wit.amount} {wit.asset}</div>
                                                {(wit.fee ?? 0) > 0 && <div className="text-xs text-error font-bold">-{wit.fee} Fee</div>}
                                            </td>
                                            <td className="py-4 text-white font-mono font-bold text-success">{wit.amountReceived ?? wit.amount} {wit.asset}</td>
                                            <td className="py-4 text-xs font-mono text-slate-400 truncate max-w-[200px]">{wit.walletAddress}</td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleApproveWithdrawal(wit._id)} className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg text-sm font-medium transition-colors">
                                                        Confirm Send
                                                    </button>
                                                    <button onClick={async () => { if (confirm('Deny?')) await api.post(`/admin/withdrawals/${wit._id}/deny`); fetchData(); }} className="p-2 bg-error/10 text-error hover:bg-error/20 rounded-lg transition-colors">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingWithdrawals.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-500">No pending withdrawals</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'config' && (
                <div className="card space-y-8">
                    <div>
                        <h4 className="font-bold text-white mb-4">Supported Assets</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assets.map(a => (
                                <div key={a._id} className="p-4 bg-dark rounded-lg border border-slate-700 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-bold">{a.symbol}</p>
                                        <p className="text-xs text-slate-500">{a.name} ({a.decimals} decimals)</p>
                                    </div>
                                    <button
                                        onClick={() => toggleAsset(a._id, a.enabled)}
                                        className={`px-3 py-1 rounded text-xs font-bold ${a.enabled ? 'bg-success/20 text-success' : 'bg-slate-700 text-slate-400'}`}
                                    >
                                        {a.enabled ? 'Enabled' : 'Disabled'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-white">Central Wallet Settings</h4>
                            <button
                                onClick={() => setIsAddingWallet(!isAddingWallet)}
                                className="btn-primary text-xs px-3 py-1 flex items-center gap-1"
                            >
                                <Upload className="w-3 h-3" /> Add Config
                            </button>
                        </div>

                        {isAddingWallet && (
                            <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
                                <h5 className="text-sm font-bold text-white mb-3">New Wallet Configuration</h5>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Asset</label>
                                            <select
                                                className="input-field text-sm"
                                                value={newWallet.asset}
                                                onChange={e => setNewWallet({ ...newWallet, asset: e.target.value })}
                                            >
                                                <option value="">Select Asset</option>
                                                {assets.map(a => <option key={a._id} value={a.symbol}>{a.symbol}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Network</label>
                                            <select
                                                className="input-field text-sm"
                                                value={newWallet.network}
                                                onChange={e => setNewWallet({ ...newWallet, network: e.target.value })}
                                            >
                                                <option value="">Select Network</option>
                                                {networks.map(n => <option key={n._id} value={n.name}>{n.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Central Wallet Address</label>
                                        <input
                                            type="text"
                                            className="input-field text-sm"
                                            placeholder="e.g. T..."
                                            value={newWallet.centralWallet}
                                            onChange={e => setNewWallet({ ...newWallet, centralWallet: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">QR Code Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            onChange={e => setNewWallet({ ...newWallet, file: e.target.files ? e.target.files[0] : null })}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsAddingWallet(false)}
                                            className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddWallet}
                                            disabled={addingWalletLoading}
                                            className="btn-primary text-xs px-4 py-1.5"
                                        >
                                            {addingWalletLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create Configuration'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {walletSettings.map(s => (
                                <WalletSettingItem key={s._id} setting={s} onUpdate={fetchData} />
                            ))}
                            {walletSettings.length === 0 && !isAddingWallet && (
                                <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                                    No wallet configurations found. Add one to start receiving deposits.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-3 text-sm text-slate-400">
                        <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                        <p>Asset and Network metadata is currently static for the MVP. Advanced management including cold wallet balance checks is planned for v2.1.</p>
                    </div>

                    <div className="pt-8 border-t border-slate-700/50">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-warning" /> Global App Settings
                        </h4>
                        <div className="p-6 bg-dark rounded-xl border border-slate-700/50 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold">Maintenance Mode</p>
                                    <p className="text-xs text-slate-500">Block all non-admin access to the system</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const newStatus = !appSettings?.maintenanceMode;
                                        try {
                                            await api.put('/admin/app-settings', { maintenanceMode: newStatus });
                                            fetchData();
                                        } catch (err: any) {
                                            const msg = err.response?.data?.error || err.message || 'Unknown error';
                                            alert(`Failed to toggle maintenance mode: ${msg}`);
                                        }
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${appSettings?.maintenanceMode ? 'bg-error' : 'bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${appSettings?.maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {appSettings?.maintenanceMode && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs text-slate-400">Maintenance Message</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            className="input-field grow text-sm"
                                            value={appSettings?.maintenanceMessage}
                                            onChange={(e) => setAppSettings((prev: AppSettings | null) => prev ? { ...prev, maintenanceMessage: e.target.value } : null)}
                                        />
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.put('/admin/app-settings', { maintenanceMessage: appSettings?.maintenanceMessage });
                                                    alert('Message updated');
                                                } catch (err) { alert('Failed to update message'); }
                                            }}
                                            className="btn-primary text-xs px-4"
                                        >
                                            Update Message
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'balances' && (
                <div className="card space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-white">All User Balances</h3>
                        <div className="relative max-w-sm w-full">
                            <input
                                type="text"
                                placeholder="Search user by email..."
                                className="input-field pl-10 text-sm"
                                value={balanceSearch}
                                onChange={(e) => setBalanceSearch(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <ShieldCheck className="w-4 h-4" /> {/* Reusing ShieldCheck for search icon since it's admin themed */}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                <tr>
                                    <th className="pb-3">User Email</th>
                                    <th className="pb-3">Asset</th>
                                    <th className="pb-3 text-right">Available Balance</th>
                                    <th className="pb-3 text-right">Locked (Pending Exit)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {balances
                                    .filter(bal => {
                                        const email = getUserEmail(bal.userId).toLowerCase();
                                        return email.includes(balanceSearch.toLowerCase());
                                    })
                                    .map(bal => (
                                        <tr key={bal._id}>
                                            <td className="py-4 text-slate-200">{getUserEmail(bal.userId)}</td>
                                            <td className="py-4 text-slate-400 font-bold">{bal.asset}</td>
                                            <td className="py-4 text-right text-white font-mono">{bal.amount}</td>
                                            <td className="py-4 text-right text-warning font-mono">{bal.lockedAmount}</td>
                                        </tr>
                                    ))}
                                {balances.filter(bal => getUserEmail(bal.userId).toLowerCase().includes(balanceSearch.toLowerCase())).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-500">
                                            {balanceSearch ? `No balances found matching "${balanceSearch}"` : 'No balances found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'signals' && (
                <div className="space-y-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <BadgeCheck className="w-5 h-5 text-primary" /> Manage Signals
                            </h3>
                            <button 
                                onClick={() => setIsAddingSignal(!isAddingSignal)}
                                className="btn-primary text-xs px-4 py-2"
                            >
                                {isAddingSignal ? 'Cancel' : 'Create New Signal'}
                            </button>
                        </div>

                        {isAddingSignal && (
                            <div className="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Symbol / Pair</label>
                                        <select 
                                            className="input-field" 
                                            value={newSignal.symbol}
                                            onChange={e => setNewSignal({...newSignal, symbol: e.target.value})}
                                        >
                                            <option value="">Select Asset Pair</option>
                                            {assets.filter(a => a.symbol !== 'USDT').map(asset => (
                                                <option key={asset._id} value={`${asset.symbol}/USDT`}>{asset.symbol}/USDT</option>
                                            ))}
                                            {/* fallback if no assets or for special pairs */}
                                            {assets.length === 0 && (
                                                <>
                                                    <option value="BTC/USDT">BTC/USDT</option>
                                                    <option value="ETH/USDT">ETH/USDT</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Signal Type</label>
                                        <select 
                                            className="input-field"
                                            value={newSignal.type}
                                            onChange={e => setNewSignal({...newSignal, type: e.target.value as any})}
                                        >
                                            <option value="daily">Daily Signal (12:30 / 14:30)</option>
                                            <option value="bonus">Bonus Signal</option>
                                        </select>
                                    </div>

                                    {newSignal.type === 'daily' ? (
                                        <div>
                                            <label className="text-sm text-slate-400 block mb-2">Select Time Slot</label>
                                            <select 
                                                className="input-field"
                                                value={newSignal.timeSlot}
                                                onChange={e => setNewSignal({...newSignal, timeSlot: e.target.value as any})}
                                            >
                                                <option value="12:30">12:30 - 12:40</option>
                                                <option value="14:30">14:30 - 14:40</option>
                                            </select>
                                            <p className="text-[10px] text-slate-500 mt-1">Daily signals must be created at least 15 minutes before they start.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="text-sm text-slate-400 block mb-2">Start Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="input-field" 
                                                    value={newSignal.startTime}
                                                    onChange={e => setNewSignal({...newSignal, startTime: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-slate-400 block mb-2">End Time (Auto Settlement)</label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="input-field" 
                                                    value={newSignal.endTime}
                                                    onChange={e => setNewSignal({...newSignal, endTime: e.target.value})}
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Profit Percentage (e.g. 0.005 for 0.5%)</label>
                                        <input 
                                            type="number" 
                                            step="0.0001"
                                            className="input-field" 
                                            value={newSignal.profitPercentage}
                                            onChange={e => setNewSignal({...newSignal, profitPercentage: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Entry Price</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            className="input-field" 
                                            value={newSignal.entryPrice}
                                            onChange={e => setNewSignal({...newSignal, entryPrice: parseFloat(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-2">Trade Direction</label>
                                        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700">
                                            <button 
                                                onClick={() => setNewSignal({...newSignal, side: 'buy'})}
                                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${newSignal.side === 'buy' ? 'bg-success text-white shadow-lg shadow-success/20' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                BUY
                                            </button>
                                            <button 
                                                onClick={() => setNewSignal({...newSignal, side: 'sell'})}
                                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${newSignal.side === 'sell' ? 'bg-error text-white shadow-lg shadow-error/20' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                SELL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <div className="flex-grow"></div>
                                    <button 
                                        className="btn-primary px-8"
                                        onClick={async () => {
                                            let payload = { ...newSignal };
                                            
                                            if (newSignal.type === 'daily') {
                                                const now = new Date();
                                                const start = new Date();
                                                const [hours, mins] = newSignal.timeSlot.split(':').map(Number);
                                                start.setHours(hours, mins, 0, 0);
                                                
                                                const diffMinutes = (start.getTime() - now.getTime()) / 60000;
                                                if (diffMinutes < 15) {
                                                    return alert(`Daily signals must be created at least 15 minutes before they start. (Starts at ${newSignal.timeSlot})`);
                                                }

                                                const end = new Date(start.getTime() + 10 * 60000);
                                                payload.startTime = start.toISOString();
                                                payload.endTime = end.toISOString();
                                            } else {
                                                if (!newSignal.startTime || !newSignal.endTime) {
                                                    return alert('Please set start and end times for bonus signals');
                                                }
                                            }

                                            if (!newSignal.symbol) {
                                                return alert('Please enter a symbol');
                                            }

                                            try {
                                                await api.post('/signals', payload);
                                                setIsAddingSignal(false);
                                                fetchData();
                                            } catch (err) { alert('Failed to create signal'); }
                                        }}
                                    >
                                        Create Signal
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                    <tr>
                                        <th className="pb-3">Symbol</th>
                                        <th className="pb-3">Side</th>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">Start Time</th>
                                        <th className="pb-3">End Time</th>
                                        <th className="pb-3">Profit %</th>
                                        <th className="pb-3 text-right">Status/Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {signals.map(s => (
                                        <tr key={s._id}>
                                            <td className="py-4 text-white font-bold">{s.symbol}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.side === 'buy' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                    {s.side}
                                                </span>
                                            </td>
                                            <td className="py-4 uppercase text-xs text-slate-400">{s.type}</td>
                                            <td className="py-4 text-slate-300 text-sm">{new Date(s.startTime).toLocaleString()}</td>
                                            <td className="py-4 text-slate-300 text-sm">{new Date(s.endTime).toLocaleString()}</td>
                                            <td className="py-4 text-primary font-mono">{(s.profitPercentage * 100).toFixed(3)}%</td>
                                             <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                        s.status === 'active' ? 'bg-success/20 text-success' : 
                                                        s.status === 'expired' ? 'bg-slate-700 text-slate-400' : 'bg-error/20 text-error'
                                                    }`}>
                                                        {s.status}
                                                    </span>
                                                    <button 
                                                        onClick={() => {
                                                            const text = `🚀 *New Trade Signal*\n\n🔹 Pair: ${s.symbol}\n↕️ Side: ${s.side.toUpperCase()}\n🕒 Start: ${new Date(s.startTime).toLocaleTimeString()}\n🕒 End: ${new Date(s.endTime).toLocaleTimeString()}\n💰 Profit: ${(s.profitPercentage * 100).toFixed(3)}%\n\nJoin now on the Trading Dashboard!`;
                                                            navigator.clipboard.writeText(text);
                                                            alert('Signal details copied to clipboard!');
                                                        }}
                                                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                                        title="Copy Signal Details"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {signals.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-slate-500">No signals created yet</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'trading' && (
                <div className="space-y-8">

                    {/* Pending Manual Settlements */}
                    <div className="card">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                             <CircleAlert className="w-5 h-5 text-warning" /> Settle Manual Trades
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                    <tr>
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Trade Detail</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">PnL Result</th>
                                        <th className="pb-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {pendingSettlements.map(t => (
                                        <tr key={t._id}>
                                            <td className="py-4">
                                                <p className="text-slate-200 text-sm">{t.userId?.email}</p>
                                                <p className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <div>
                                                        <p className="text-white text-xs font-bold">{t.pair}</p>
                                                        <p className={`text-[10px] uppercase ${t.type === 'buy' ? 'text-success' : 'text-error'}`}>{t.type} @ {t.price}</p>
                                                    </div>
                                                    {t.matchedSignal && (
                                                        <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[9px] text-primary flex items-center gap-1">
                                                            <BadgeCheck className="w-3 h-3" /> MATCHED SIGNAL
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-white font-mono">{t.amount} USDT</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="number" 
                                                                id={`pnl-${t._id}`}
                                                                placeholder="PnL Amount" 
                                                                defaultValue={t.matchedSignal ? (t.amount * t.matchedSignal.profitPercentage).toFixed(4) : ''}
                                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs w-24 text-white" 
                                                            />
                                                            <select 
                                                                id={`status-${t._id}`} 
                                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                                defaultValue={t.matchedSignal ? 'win' : 'win'}
                                                            >
                                                                <option value="win">Win</option>
                                                                <option value="loss">Loss</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="border-l border-slate-700 pl-4 py-1">
                                                        <LivePnL baseAmount={t.amount} tradeId={t._id} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button 
                                                    onClick={async () => {
                                                        const pnlInput = document.getElementById(`pnl-${t._id}`) as HTMLInputElement;
                                                        const statusInput = document.getElementById(`status-${t._id}`) as HTMLSelectElement;
                                                        const pnl = pnlInput.value;
                                                        const status = statusInput.value;
                                                        if (!pnl) return alert('Enter PnL amount');
                                                        try {
                                                            await api.post('/trades/settle', {
                                                                tradeId: t._id,
                                                                resultStatus: status,
                                                                pnlAmount: Number(pnl) * (status === 'loss' ? -1 : 1),
                                                                signalId: t.matchedSignal?._id
                                                            });
                                                            fetchData();
                                                        } catch (err) { alert('Settlement failed'); }
                                                    }}
                                                    className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark transition-colors"
                                                >
                                                    Settle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingSettlements.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-500">No pending manual settlements</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
            )}

            {activeTab === 'referrals' && (
                <div className="card space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-primary" /> Referral Management
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Add a bonus to a referrer once their referred friend completes their first deposit.
                        </p>
                    </div>

                    {referralMessage && (
                        <div className="p-4 bg-success/15 border border-success/30 rounded-lg text-success text-sm flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4" /> {referralMessage}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                                <tr>
                                    <th className="pb-3 pl-4">Referred User</th>
                                    <th className="pb-3">Referred By</th>
                                    <th className="pb-3">Joined Date</th>
                                    <th className="pb-3">Deposits</th>
                                    <th className="pb-3">Referrer's Bonus</th>
                                    <th className="pb-3 text-right pr-4">Add Bonus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {referrals.map(r => (
                                    <tr key={r._id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="py-4 pl-4">
                                            <p className="text-white font-semibold text-sm">{r.name || '—'}</p>
                                            <p className="text-xs text-slate-500">{r.email}</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-slate-200 text-sm">{r.referredBy?.name || '—'}</p>
                                            <p className="text-xs text-slate-500">{r.referredBy?.email || '—'}</p>
                                            {r.referredBy?.referralCode && (
                                                <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                                                    {r.referredBy.referralCode}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 text-sm text-slate-300">
                                            {new Date(r.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                r.hasDeposited ? 'bg-success/15 text-success border border-success/30' : 'bg-error/15 text-error border border-error/30'
                                            }`}>
                                                {r.hasDeposited ? `✓ ${r.completedDepositCount} completed` : 'Awaiting deposit'}
                                            </span>
                                        </td>
                                        <td className="py-4 font-bold text-sm text-white">
                                            {r.currentBonus} USDT
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <div className="flex justify-end items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    placeholder="Amount"
                                                    value={bonusAmounts[r._id] || ''}
                                                    onChange={(e) => setBonusAmounts(prev => ({ ...prev, [r._id]: e.target.value }))}
                                                    disabled={!r.hasDeposited}
                                                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs w-24 text-white focus:outline-none focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                                                />
                                                <button
                                                    onClick={() => handleAddBonus(r._id)}
                                                    disabled={!r.hasDeposited}
                                                    className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-dark font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    title={!r.hasDeposited ? 'Referred user must complete a deposit first' : 'Add bonus to referrer'}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {referrals.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-slate-500">
                                            No referrals tracked yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const WalletSettingItem: React.FC<{ setting: WalletSettings; onUpdate: () => void }> = ({ setting, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [address, setAddress] = useState(setting.centralWallet);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSave = async () => {
        setUploading(true);
        const formData = new FormData();
        formData.append('asset', setting.asset);
        formData.append('network', setting.network);
        formData.append('centralWallet', address);
        formData.append('enabled', String(setting.enabled));
        if (file) {
            formData.append('qrCode', file);
        }

        try {
            await api.post('/admin/wallet-settings', formData);
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error('Failed to update wallet settings', err);
            const msg = (err as any).response?.data?.error || 'Failed to update settings';
            alert(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 bg-dark rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-primary uppercase">{setting.asset} / {setting.network}</span>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-slate-400 hover:text-white underline"
                >
                    {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Wallet Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="input-field text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 block mb-1">Update QR Code</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={uploading}
                        className="btn-primary w-full text-sm py-2"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 items-start">
                    <div className="flex-1">
                        <label className="text-[10px] text-slate-500 uppercase block mb-1">Current Address</label>
                        <p className="text-sm font-mono text-slate-300 break-all">{setting.centralWallet}</p>
                    </div>
                    {setting.qrCodeUrl && (
                        <div className="shrink-0">
                            <img src={setting.qrCodeUrl} alt="QR Code" className="w-16 h-16 rounded border border-slate-700" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
