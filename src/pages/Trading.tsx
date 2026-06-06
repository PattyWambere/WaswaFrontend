import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { executeTrade } from '../services/tradeService';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    CheckCircle2, 
    CircleAlert,
    ChevronDown,
    X,
    Info
} from 'lucide-react';
import { Balance } from '../types';
import { LivePnL } from '../components/LivePnL';
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const TRADING_PAIRS = [
    { id: 'BTC/USDT', name: 'BTC/USDT', price: 50200 },
    { id: 'ETH/USDT', name: 'ETH/USDT', price: 2850 },
    { id: 'USDT/USD', name: 'USDT/USD', price: 1.00 }
];

const PERCENTAGES = [1, 25, 50, 75, 100];

export const Trading: React.FC = () => {
    const [balances, setBalances] = useState<Balance[]>([]);
    const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0]);
    const [amountPercentage, setAmountPercentage] = useState(1);
    const [tradeAmount, setTradeAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [trades, setTrades] = useState<any[]>([]);
    const [selectedTrade, setSelectedTrade] = useState<any | null>(null);

    const usdtBalance = balances.find(b => b.asset === 'USDT')?.amount || 0;
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                try {
                    const balRes = await api.get('/user/balances');
                    setBalances(balRes.data);
                } catch (err) {
                    console.error('Failed to fetch balances', err);
                }

                try {
                    const tradeRes = await api.get('/trades/my-trades');
                    setTrades(tradeRes.data);
                } catch (err) {
                    console.error('Failed to fetch trades', err);
                }
            } catch (err) {
                console.error('Failed to fetch user trade data', err);
            }
        };
        fetchBalances();

        // Polling interval of 5 seconds to keep trade list and balances updated
        const interval = setInterval(fetchBalances, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const amount = (usdtBalance * amountPercentage) / 100;
        setTradeAmount(Number(amount.toFixed(2)));
    }, [amountPercentage, usdtBalance]);

    const handleTrade = async (type: 'buy' | 'sell') => {
        if (tradeAmount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid amount' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            await executeTrade({
                pair: selectedPair.id,
                type,
                amount: tradeAmount,
                price: selectedPair.price
            });
            setMessage({ type: 'success', text: `Successfully executed ${type} order for ${selectedPair.id}` });
            
            // Refresh
            fetchDashboardData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.error || 'Trade failed' });
        } finally {
            setLoading(false);
        }
    };


    const fetchDashboardData = async () => {
        try {
            try {
                const balRes = await api.get('/user/balances');
                setBalances(balRes.data);
            } catch (err) {
                console.error('Failed to refresh balances', err);
            }

            try {
                const tradeRes = await api.get('/trades/my-trades');
                setTrades(tradeRes.data);
            } catch (err) {
                console.error('Failed to refresh trades', err);
            }
        } catch (err) {
            console.error('Failed to refresh data', err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-primary w-8 h-8" /> Crypto Trading
                    </h1>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        Available Balance: <span className="text-white font-bold">${usdtBalance.toLocaleString()}</span>
                    </p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                    message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <CircleAlert className="w-5 h-5 shrink-0" />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}


            {/* Trading Pair Selector */}
            <div className="card">
                <label className="text-slate-400 text-sm font-medium block mb-2">Select Trading Pair</label>
                <div className="relative group">
                    <select
                        value={selectedPair.id}
                        onChange={(e) => {
                            const pair = TRADING_PAIRS.find(p => p.id === e.target.value);
                            if (pair) setSelectedPair(pair);
                        }}
                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-4 px-4 text-white font-bold appearance-none outline-none focus:border-primary/50 transition-all cursor-pointer group-hover:bg-slate-800"
                    >
                        {TRADING_PAIRS.map((pair) => (
                            <option key={pair.id} value={pair.id}>
                                {pair.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-primary transition-colors">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="card h-[500px] overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">{selectedPair.name}</h3>
                        <p className="text-primary font-mono text-lg">${selectedPair.price.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-700/50">
                    <AdvancedRealTimeChart 
                        theme="dark" 
                        symbol={`BINANCE:${selectedPair.id.replace('/', '')}`} 
                        autosize
                        hide_top_toolbar={false}
                        hide_legend={false}
                        save_image={false}
                        backgroundColor="#0f172a"
                    />
                </div>
            </div>

            {/* Amount Selection */}
            <div className="card space-y-6">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-3">Select Amount Percentage</p>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>1%</span>
                            <span>100%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            step="1"
                            value={amountPercentage}
                            onChange={(e) => setAmountPercentage(Number(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="grid grid-cols-5 gap-2">
                            {PERCENTAGES.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setAmountPercentage(p)}
                                    className={`py-2 rounded-lg text-sm font-bold transition-all ${
                                        amountPercentage === p 
                                        ? 'bg-primary text-white shadow-md' 
                                        : 'bg-slate-800/50 text-slate-500 hover:bg-slate-800'
                                    }`}
                                >
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-slate-400 text-sm font-medium block mb-2">Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input 
                            type="number" 
                            value={tradeAmount}
                            onChange={(e) => setTradeAmount(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xl focus:border-primary/50 outline-none transition-colors"
                        />
                    </div>
                    <p className="text-slate-500 text-xs mt-2">{amountPercentage}% of available balance</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => handleTrade('buy')}
                    disabled={loading}
                    className="py-5 rounded-2xl bg-success text-white font-bold text-xl shadow-lg shadow-success/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <TrendingUp className="w-6 h-6" /> Buy
                </button>
                <button 
                    onClick={() => handleTrade('sell')}
                    disabled={loading}
                    className="py-5 rounded-2xl bg-error text-white font-bold text-xl shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <TrendingDown className="w-6 h-6" /> Sell
                </button>
            </div>


            {/* Trade History */}
            <div className="card">
                <h3 className="text-xl font-bold text-white mb-6">Recent Trades</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-slate-500 text-sm border-b border-slate-700/50">
                            <tr>
                                <th className="pb-3 text-xs uppercase">Pair</th>
                                <th className="pb-3 text-xs uppercase">Type</th>
                                <th className="pb-3 text-xs uppercase text-right">Amount</th>
                                <th className="pb-3 text-xs uppercase text-right">PnL</th>
                                <th className="pb-3 text-xs uppercase text-right">Status</th>
                                <th className="pb-3 text-xs uppercase text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {trades.map((t) => (
                                <tr key={t._id} onClick={() => setSelectedTrade(t)} className="cursor-pointer hover:bg-slate-800/50 transition-colors group">
                                    <td className="py-4">
                                        <p className="text-white font-bold text-sm">{t.pair}</p>
                                        <p className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                                    </td>
                                    <td className="py-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${t.type === 'buy' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="text-slate-200 text-sm font-mono">{t.amount.toFixed(2)} USDT</p>
                                        <p className="text-[10px] text-slate-500">at ${t.price.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 text-right">
                                        {t.isSettled ? (
                                            <span className={`text-sm font-bold font-mono ${t.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                                                {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(4)} USDT
                                            </span>
                                        ) : (
                                            <LivePnL baseAmount={t.amount} tradeId={t._id} />
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        {t.isSettled ? (
                                            <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${t.resultStatus === 'win' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                {t.resultStatus.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-primary font-bold animate-pulse uppercase tracking-wider">Active Order</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="text-slate-500 hover:text-primary transition-colors p-1 opacity-50 group-hover:opacity-100">
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {trades.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-slate-500 text-sm">
                                        No recent trades found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trade Details Modal */}
            {selectedTrade && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Order Details</h3>
                            <button onClick={() => setSelectedTrade(null)} className="text-slate-400 hover:text-white transition-colors p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Order ID</span>
                                <span className="text-white font-mono text-xs sm:text-sm">{selectedTrade._id}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Placed At</span>
                                <span className="text-slate-200 text-sm">{new Date(selectedTrade.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Pair</span>
                                <span className="text-white font-bold">{selectedTrade.pair}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Type</span>
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${selectedTrade.type === 'buy' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                    {selectedTrade.type}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Amount</span>
                                <span className="text-white font-mono">{selectedTrade.amount.toFixed(2)} USDT</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Entry Price</span>
                                <span className="text-slate-200 font-mono">${selectedTrade.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Signal Eligible</span>
                                <span className={`text-xs font-bold ${selectedTrade.isSignalEligible ? 'text-success' : 'text-slate-500'}`}>
                                    {selectedTrade.isSignalEligible ? 'Yes (1%)' : 'No (Manual)'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-400 text-sm">Status</span>
                                {selectedTrade.isSettled ? (
                                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${selectedTrade.resultStatus === 'win' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                        {selectedTrade.resultStatus.toUpperCase()}
                                    </span>
                                ) : (
                                    <span className="text-xs text-primary font-bold animate-pulse uppercase tracking-wider">Active Order</span>
                                )}
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-400 text-sm">PnL</span>
                                {selectedTrade.isSettled ? (
                                    <span className={`font-bold font-mono ${selectedTrade.pnl >= 0 ? 'text-success' : 'text-error'}`}>
                                        {selectedTrade.pnl >= 0 ? '+' : ''}{selectedTrade.pnl.toFixed(4)} USDT
                                    </span>
                                ) : (
                                    <span className="text-slate-500 italic text-sm">Pending Settlement</span>
                                )}
                            </div>
                        </div>
                        
                        <button onClick={() => setSelectedTrade(null)} className="w-full mt-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
